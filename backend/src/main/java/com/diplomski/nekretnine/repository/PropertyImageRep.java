package com.diplomski.nekretnine.repository;

import com.diplomski.nekretnine.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyImageRep extends JpaRepository<PropertyImage, Long> {
}