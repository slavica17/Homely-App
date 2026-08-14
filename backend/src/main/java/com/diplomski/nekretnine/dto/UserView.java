package com.diplomski.nekretnine.dto;

import com.diplomski.nekretnine.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserView {

    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private boolean approved;
    private boolean blocked;
    private String profileImage;

    public UserView(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.approved = user.isApproved();
        this.blocked = user.isBlocked();
        this.profileImage = user.getProfileImage();
    }
}