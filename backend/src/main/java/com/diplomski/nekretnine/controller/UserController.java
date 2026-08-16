package com.diplomski.nekretnine.controller;

import com.diplomski.nekretnine.dto.PasswordChangeReq;
import com.diplomski.nekretnine.dto.ProfileUpdateReq;
import com.diplomski.nekretnine.dto.UserView;
import com.diplomski.nekretnine.model.User;
import com.diplomski.nekretnine.repository.UserRep;
import com.diplomski.nekretnine.security.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRep userRep;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public UserController(UserRep userRep, PasswordEncoder passwordEncoder, FileStorageService fileStorageService) {
        this.userRep = userRep;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        User user = userRep.findByUsername(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        return ResponseEntity.ok(new UserView(user));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateReq request, Authentication auth) {
        User user = userRep.findByUsername(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }

        if (!user.getEmail().equals(request.getEmail()) && userRep.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists.");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        userRep.save(user);

        return ResponseEntity.ok(new UserView(user));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeReq request, Authentication auth) {
        User user = userRep.findByUsername(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRep.save(user);

        return ResponseEntity.ok("Password changed.");
    }

    @PostMapping("/me/image")
    public ResponseEntity<?> updateImage(@RequestParam("image") MultipartFile file, Authentication auth) {
        User user = userRep.findByUsername(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("No image provided.");
        }

        String path = fileStorageService.store(file);
        user.setProfileImage(path);
        userRep.save(user);

        return ResponseEntity.ok(new UserView(user));
    }
}