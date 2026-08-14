package com.diplomski.nekretnine.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "property_images")
@Getter
@Setter
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String path;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}