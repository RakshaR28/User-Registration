package com.example.User.app.dto;

import lombok.Data;


@Data
public class AddressRequest {

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String countryCode;
    private String postalCode;

    private String addressType; // CURRENT / PERMANENT
}
