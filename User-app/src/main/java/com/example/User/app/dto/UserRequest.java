package com.example.User.app.dto;
import lombok.Data;
import java.util.List;

import java.util.List;

@Data
public class UserRequest {

    private String firstName;
    private String lastName;
    private String email;

    private List<AddressRequest> addresses;
}