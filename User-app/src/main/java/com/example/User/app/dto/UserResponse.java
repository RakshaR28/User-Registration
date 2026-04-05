package com.example.User.app.dto;

import lombok.Data;

import java.util.List;


@Data
public class UserResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;

    private List<AddressResponse> addresses;

    /*public void setPermanentAddress(String addressLine1) {
    }

    public void setCurrentAddress(String addressLine1) {
    }*/
}