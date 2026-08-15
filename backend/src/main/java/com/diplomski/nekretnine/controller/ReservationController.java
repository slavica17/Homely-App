package com.diplomski.nekretnine.controller;

import com.diplomski.nekretnine.dto.ReservationReq;
import com.diplomski.nekretnine.dto.ReservationView;
import com.diplomski.nekretnine.model.Property;
import com.diplomski.nekretnine.model.Reservation;
import com.diplomski.nekretnine.model.ReservationStatus;
import com.diplomski.nekretnine.model.User;
import com.diplomski.nekretnine.repository.PropertyRep;
import com.diplomski.nekretnine.repository.ReservationRep;
import com.diplomski.nekretnine.repository.UserRep;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

  private final ReservationRep reservationRep;
  private final PropertyRep propertyRep;
  private final UserRep userRep;

  public ReservationController(ReservationRep reservationRep, PropertyRep propertyRep, UserRep userRep) {
    this.reservationRep = reservationRep;
    this.propertyRep = propertyRep;
    this.userRep = userRep;
  }

  @PostMapping
  public ResponseEntity<?> create(@Valid @RequestBody ReservationReq request, Authentication auth) {
    User tenant = userRep.findByUsername(auth.getName()).orElse(null);
    if (tenant == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
    }

    Optional<Property> optional = propertyRep.findById(request.getPropertyId());
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found.");
    }
    Property property = optional.get();

    if (request.getEndDate().isBefore(request.getStartDate())) {
      return ResponseEntity.badRequest().body("End date must be after start date.");
    }

    Reservation reservation = new Reservation();
    reservation.setProperty(property);
    reservation.setTenant(tenant);
    reservation.setStartDate(request.getStartDate());
    reservation.setEndDate(request.getEndDate());
    reservation.setStatus(ReservationStatus.PENDING);

    reservationRep.save(reservation);
    return ResponseEntity.status(HttpStatus.CREATED).body(new ReservationView(reservation));
  }

  @GetMapping("/my")
  public List<ReservationView> myReservations(Authentication auth) {
    User tenant = userRep.findByUsername(auth.getName()).orElseThrow();
    return reservationRep.findByTenant(tenant).stream()
        .map(ReservationView::new)
        .toList();
  }

  @GetMapping("/received")
  public List<ReservationView> receivedReservations(Authentication auth) {
    User owner = userRep.findByUsername(auth.getName()).orElseThrow();
    return reservationRep.findByPropertyOwner(owner).stream()
        .map(ReservationView::new)
        .toList();
  }

  @PutMapping("/{id}/status")
  public ResponseEntity<?> updateStatus(@PathVariable Long id,
      @RequestParam String status,
      Authentication auth) {
    Optional<Reservation> optional = reservationRep.findById(id);
    if (optional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found.");
    }
    Reservation reservation = optional.get();

    if (!reservation.getProperty().getOwner().getUsername().equals(auth.getName())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your property.");
    }

    if (status.equals("ACCEPTED")) {
      reservation.setStatus(ReservationStatus.ACCEPTED);
    } else if (status.equals("REJECTED")) {
      reservation.setStatus(ReservationStatus.REJECTED);
    } else {
      return ResponseEntity.badRequest().body("Invalid status.");
    }

    reservationRep.save(reservation);
    return ResponseEntity.ok(new ReservationView(reservation));
  }
}