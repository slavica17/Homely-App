package com.diplomski.nekretnine.dto;

import com.diplomski.nekretnine.model.Property;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyView {

  private Long id;
  private String title;
  private String description;
  private String location;
  private Double price;
  private String type;
  private boolean available;
  private String ownerUsername;
  private Long ownerId;
  private java.util.List<String> images;

  public PropertyView(Property property) {
    this.id = property.getId();
    this.title = property.getTitle();
    this.description = property.getDescription();
    this.location = property.getLocation();
    this.price = property.getPrice();
    this.type = property.getType().name();
    this.available = property.isAvailable();
    if (property.getOwner() != null) {
      this.ownerUsername = property.getOwner().getUsername();
      this.ownerId = property.getOwner().getId();
    }
    this.images = property.getImages().stream().map(img -> img.getPath()).toList();
  }
}