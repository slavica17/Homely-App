package com.diplomski.nekretnine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeReq {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
        message = "Password must have at least 8 characters, one uppercase letter, one number and one special character"
    )
    private String newPassword;
}