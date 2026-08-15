package com.diplomski.nekretnine.dto;

import com.diplomski.nekretnine.model.Reservation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationView {

    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String tenantUsername;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public ReservationView(Reservation r) {
        this.id = r.getId();
        this.propertyId = r.getProperty().getId();
        this.propertyTitle = r.getProperty().getTitle();
        this.tenantUsername = r.getTenant().getUsername();
        this.startDate = r.getStartDate();
        this.endDate = r.getEndDate();
        this.status = r.getStatus().name();
    }
}