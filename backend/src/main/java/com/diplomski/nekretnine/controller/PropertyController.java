package com.diplomski.nekretnine.controller;

import com.diplomski.nekretnine.dto.PropertyReq;
import com.diplomski.nekretnine.dto.PropertyView;
import com.diplomski.nekretnine.model.Property;
import com.diplomski.nekretnine.model.User;
import com.diplomski.nekretnine.repository.PropertyRep;
import com.diplomski.nekretnine.repository.UserRep;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

  private final PropertyRep propertyRep;
  private final UserRep userRep;

  public PropertyController(PropertyRep propertyRep, UserRep userRep) {
    this.propertyRep = propertyRep;
    this.userRep = userRep;
  }

  @GetMapping
  public List<PropertyView> getAll() {
    return propertyRep.findAll().stream()
        .map(PropertyView::new)
        .toList();
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOne(@PathVariable Long id) {
    Optional<Property> optional = propertyRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found.");
    }
    return ResponseEntity.ok(new PropertyView(optional.get()));
  }

  @PostMapping
  public ResponseEntity<?> create(@Valid @RequestBody PropertyReq request, Authentication auth) {
    User owner = userRep.findByUsername(auth.getName()).orElse(null);
    if (owner == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
    }

    Property property = new Property();
    property.setTitle(request.getTitle());
    property.setDescription(request.getDescription());
    property.setLocation(request.getLocation());
    property.setPrice(request.getPrice());
    property.setType(request.getType());
    property.setAvailable(true);
    property.setOwner(owner);

    propertyRep.save(property);
    return ResponseEntity.status(HttpStatus.CREATED).body(new PropertyView(property));
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody PropertyReq request, Authentication auth) {
    Optional<Property> optional = propertyRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found.");
    }
    Property property = optional.get();

    if (!property.getOwner().getUsername().equals(auth.getName())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own properties.");
    }

    property.setTitle(request.getTitle());
    property.setDescription(request.getDescription());
    property.setLocation(request.getLocation());
    property.setPrice(request.getPrice());
    property.setType(request.getType());

    propertyRep.save(property);
    return ResponseEntity.ok(new PropertyView(property));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
    Optional<Property> optional = propertyRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found.");
    }
    Property property = optional.get();

    if (!property.getOwner().getUsername().equals(auth.getName())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own properties.");
    }

    propertyRep.deleteById(id);
    return ResponseEntity.ok("Property deleted.");
  }
}