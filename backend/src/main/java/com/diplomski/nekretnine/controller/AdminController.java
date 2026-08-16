package com.diplomski.nekretnine.controller;

import com.diplomski.nekretnine.dto.UserView;
import com.diplomski.nekretnine.model.User;
import com.diplomski.nekretnine.model.UserRole;
import com.diplomski.nekretnine.repository.UserRep;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.diplomski.nekretnine.dto.PropertyView;
import com.diplomski.nekretnine.repository.PropertyRep;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final UserRep userRep;
  private final PropertyRep propertyRep;

  public AdminController(UserRep userRep, PropertyRep propertyRep) {
    this.userRep = userRep;
    this.propertyRep = propertyRep;
  }

  @GetMapping("/users")
  public List<UserView> getAllUsers() {
    return userRep.findAll().stream()
        .filter(u -> u.getRole() != UserRole.ADMIN)
        .map(UserView::new)
        .toList();
  }

  @GetMapping("/users/pending")
  public List<UserView> getPendingUsers() {
    return userRep.findByApprovedFalse().stream()
        .filter(u -> u.getRole() != UserRole.ADMIN)
        .map(UserView::new)
        .toList();
  }

  @PutMapping("/users/{id}/approve")
  public ResponseEntity<String> approveUser(@PathVariable Long id) {
    Optional<User> optionalUser = userRep.findById(id);
    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
    User user = optionalUser.get();
    user.setApproved(true);
    userRep.save(user);
    return ResponseEntity.ok("User approved.");
  }

  @PutMapping("/users/{id}/block")
  public ResponseEntity<String> toggleBlock(@PathVariable Long id) {
    Optional<User> optionalUser = userRep.findById(id);
    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
    User user = optionalUser.get();
    user.setBlocked(!user.isBlocked());
    userRep.save(user);
    return ResponseEntity.ok(user.isBlocked() ? "User blocked." : "User unblocked.");
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    Optional<User> optionalUser = userRep.findById(id);
    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
    userRep.deleteById(id);
    return ResponseEntity.ok("User deleted.");
  }

  @GetMapping("/properties")
  public List<PropertyView> getAllProperties() {
    return propertyRep.findAll().stream()
        .map(PropertyView::new)
        .toList();
  }

  @DeleteMapping("/properties/{id}")
  public ResponseEntity<String> deleteProperty(@PathVariable Long id) {
    if (!propertyRep.existsById(id)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found.");
    }
    propertyRep.deleteById(id);
    return ResponseEntity.ok("Property deleted.");
  }

}