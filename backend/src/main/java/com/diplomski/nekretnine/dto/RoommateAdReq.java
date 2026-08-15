package com.diplomski.nekretnine.dto;

import com.diplomski.nekretnine.model.RoommateAdType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoommateAdReq {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private Double price;

    @NotNull(message = "Ad type is required")
    private RoommateAdType adType;
}