package com.diplomski.nekretnine.repository;

import com.diplomski.nekretnine.model.Property;
import com.diplomski.nekretnine.model.Reservation;
import com.diplomski.nekretnine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRep extends JpaRepository<Reservation, Long> {
    List<Reservation> findByTenant(User tenant);
    List<Reservation> findByPropertyOwner(User owner);
}