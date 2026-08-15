package com.diplomski.nekretnine.dto;

import com.diplomski.nekretnine.model.RoommateAd;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoommateAdView {

  private Long id;
  private String title;
  private String description;
  private String location;
  private Double price;
  private String adType;
  private String authorUsername;
  private List<String> images;

  public RoommateAdView(RoommateAd ad) {
    this.id = ad.getId();
    this.title = ad.getTitle();
    this.description = ad.getDescription();
    this.location = ad.getLocation();
    this.price = ad.getPrice();
    this.adType = ad.getAdType().name();
    if (ad.getAuthor() != null) {
      this.authorUsername = ad.getAuthor().getUsername();
    }
    this.images = ad.getImages().stream()
        .map(img -> img.getPath())
        .toList();
  }
}