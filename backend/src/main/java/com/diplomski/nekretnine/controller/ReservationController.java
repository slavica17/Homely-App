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
import com.diplomski.nekretnine.service.EmailService;
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
  private final EmailService emailService;

  public ReservationController(ReservationRep reservationRep, PropertyRep propertyRep,
      UserRep userRep, EmailService emailService) {
    this.reservationRep = reservationRep;
    this.propertyRep = propertyRep;
    this.userRep = userRep;
    this.emailService = emailService;
  }

  // Stanar šalje zahtev za rezervaciju
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

    // mejl vlasniku da je stigao novi zahtev
    User owner = property.getOwner();
    if (owner != null && owner.getEmail() != null) {
      emailService.sendEmail(
          owner.getEmail(),
          "New reservation request - Homely",
          "Hello " + owner.getFirstName() + ",\n\n" +
              tenant.getUsername() + " has requested to reserve your property \"" +
              property.getTitle() + "\" from " + request.getStartDate() +
              " to " + request.getEndDate() + ".\n\n" +
              "Log in to Homely to accept or reject the request.");
    }

    return ResponseEntity.status(HttpStatus.CREATED).body(new ReservationView(reservation));
  }

  // Moje rezervacije (stanar)
  @GetMapping("/my")
  public List<ReservationView> myReservations(Authentication auth) {
    User tenant = userRep.findByUsername(auth.getName()).orElseThrow();
    return reservationRep.findByTenant(tenant).stream()
        .map(ReservationView::new)
        .toList();
  }

  // Zahtevi koji su stigli meni (vlasnik)
  @GetMapping("/received")
  public List<ReservationView> receivedReservations(Authentication auth) {
    User owner = userRep.findByUsername(auth.getName()).orElseThrow();
    return reservationRep.findByPropertyOwner(owner).stream()
        .map(ReservationView::new)
        .toList();
  }

  // Vlasnik prihvata/odbija
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

    User tenant = reservation.getTenant();
    if (tenant != null && tenant.getEmail() != null) {
      String outcome = reservation.getStatus() == ReservationStatus.ACCEPTED ? "accepted" : "rejected";
      emailService.sendEmail(
          tenant.getEmail(),
          "Reservation " + outcome + " - Homely",
          "Hello " + tenant.getFirstName() + ",\n\n" +
              "Your reservation request for \"" + reservation.getProperty().getTitle() +
              "\" has been " + outcome + ".\n\n" +
              "Log in to Homely to see the details.");
    }

    return ResponseEntity.ok(new ReservationView(reservation));
  }
}