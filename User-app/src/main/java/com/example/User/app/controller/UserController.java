package com.example.User.app.controller;

import com.example.User.app.dto.UserRequest;
import com.example.User.app.dto.UserResponse;
import com.example.User.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    // ✅ CREATE USER
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody UserRequest request) {
        try {
            return ResponseEntity.ok(userService.createUser(request));
        } catch (Exception e) {
            e.printStackTrace(); // VERY IMPORTANT
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ✅ GET LATEST 5 USERS
    @GetMapping("/latest")
    public ResponseEntity<List<UserResponse>> getLatestUsers() {

        List<UserResponse> users = userService.getLatestUsers();

        return ResponseEntity.ok(users);
    }
}