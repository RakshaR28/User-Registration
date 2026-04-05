package com.example.User.app.dto;


import lombok.Data;

@Data
public class AddressResponse {

    private String addressLine1;
    private String city;
    private String state;
    private String countryCode;
    private String postalCode;

    private String addressType;

}