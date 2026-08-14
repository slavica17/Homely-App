package com.diplomski.nekretnine.repository;

import com.diplomski.nekretnine.model.Property;
import com.diplomski.nekretnine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRep extends JpaRepository<Property, Long> {
    List<Property> findByOwner(User owner);
}