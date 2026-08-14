package com.diplomski.nekretnine.controller;

import com.diplomski.nekretnine.dto.LoginReq;
import com.diplomski.nekretnine.dto.RegisterReq;
import com.diplomski.nekretnine.model.User;
import com.diplomski.nekretnine.model.UserRole;
import com.diplomski.nekretnine.repository.UserRep;
import com.diplomski.nekretnine.security.FileStorageService;
import com.diplomski.nekretnine.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRep userRep;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final FileStorageService fileStorageService;

    public AuthController(UserRep userRep, PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil, FileStorageService fileStorageService) {
        this.userRep = userRep;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> register(@Valid @ModelAttribute RegisterReq request,
            BindingResult bindingResult,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        if (bindingResult.hasErrors()) {
            String msg = bindingResult.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(msg);
        }
        if (request.getRole() == UserRole.ADMIN) {
            return ResponseEntity.badRequest().body("Registration as administrator is not allowed.");
        }
        if (userRep.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists.");
        }
        if (userRep.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setApproved(false);
        user.setBlocked(false);

        if (profileImage != null && !profileImage.isEmpty()) {
            String path = fileStorageService.store(profileImage);
            user.setProfileImage(path);
        }

        userRep.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration successful! Your account is waiting for administrator approval.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginReq request) {
        Optional<User> optionalUser = userRep.findByUsername(request.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong username or password.");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong username or password.");
        }

        if (user.isBlocked()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is blocked.");
        }

        if (!user.isApproved()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Your account is waiting for administrator approval.");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole().name()));
    }
}