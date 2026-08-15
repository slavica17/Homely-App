package com.diplomski.nekretnine.controller;

import com.diplomski.nekretnine.dto.RoommateAdReq;
import com.diplomski.nekretnine.dto.RoommateAdView;
import com.diplomski.nekretnine.model.RoommateAd;
import com.diplomski.nekretnine.model.RoommateImage;
import com.diplomski.nekretnine.model.User;
import com.diplomski.nekretnine.repository.RoommateAdRep;
import com.diplomski.nekretnine.repository.RoommateImageRep;
import com.diplomski.nekretnine.repository.UserRep;
import com.diplomski.nekretnine.security.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roommates")
public class RoommateAdController {

  private final RoommateAdRep adRep;
  private final RoommateImageRep imageRep;
  private final UserRep userRep;
  private final FileStorageService fileStorageService;

  public RoommateAdController(RoommateAdRep adRep, RoommateImageRep imageRep,
      UserRep userRep, FileStorageService fileStorageService) {
    this.adRep = adRep;
    this.imageRep = imageRep;
    this.userRep = userRep;
    this.fileStorageService = fileStorageService;
  }

  @GetMapping
  public List<RoommateAdView> getAll() {
    return adRep.findAll().stream()
        .map(RoommateAdView::new)
        .toList();
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOne(@PathVariable Long id) {
    Optional<RoommateAd> optional = adRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ad not found.");
    }
    return ResponseEntity.ok(new RoommateAdView(optional.get()));
  }

  @PostMapping
  public ResponseEntity<?> create(@Valid @RequestBody RoommateAdReq request, Authentication auth) {
    User author = userRep.findByUsername(auth.getName()).orElse(null);
    if (author == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
    }

    RoommateAd ad = new RoommateAd();
    ad.setTitle(request.getTitle());
    ad.setDescription(request.getDescription());
    ad.setLocation(request.getLocation());
    ad.setPrice(request.getPrice());
    ad.setAdType(request.getAdType());
    ad.setAuthor(author);

    adRep.save(ad);
    return ResponseEntity.status(HttpStatus.CREATED).body(new RoommateAdView(ad));
  }

  @PostMapping("/{id}/images")
  public ResponseEntity<?> uploadImages(@PathVariable Long id,
      @RequestParam("images") MultipartFile[] files,
      Authentication auth) {
    Optional<RoommateAd> optional = adRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ad not found.");
    }
    RoommateAd ad = optional.get();

    if (!ad.getAuthor().getUsername().equals(auth.getName())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your ad.");
    }

    for (MultipartFile file : files) {
      if (file != null && !file.isEmpty()) {
        String path = fileStorageService.store(file);
        RoommateImage image = new RoommateImage();
        image.setPath(path);
        image.setAd(ad);
        imageRep.save(image);
      }
    }

    return ResponseEntity.ok("Images uploaded.");
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
    Optional<RoommateAd> optional = adRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ad not found.");
    }
    RoommateAd ad = optional.get();

    if (!ad.getAuthor().getUsername().equals(auth.getName())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own ads.");
    }

    adRep.deleteById(id);
    return ResponseEntity.ok("Ad deleted.");
  }
}