package com.diplomski.nekretnine.repository;

import com.diplomski.nekretnine.model.RoommateAd;
import com.diplomski.nekretnine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoommateAdRep extends JpaRepository<RoommateAd, Long> {
    List<RoommateAd> findByAuthor(User author);
}