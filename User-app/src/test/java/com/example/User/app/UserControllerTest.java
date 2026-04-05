package com.example.User.app;

import com.example.User.app.controller.UserController;
import com.example.User.app.dto.AddressRequest;
import com.example.User.app.dto.UserRequest;
import com.example.User.app.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Test
    void testCreateUser() {

        // Mock service
        UserService userService = Mockito.mock(UserService.class);

        // Inject into controller
        UserController controller = new UserController(userService);

        // ✅ Prepare nested request
        AddressRequest address = new AddressRequest();
        address.setAddressLine1("Line1");
        address.setCity("Bangalore");
        address.setState("KA");
        address.setCountryCode("IN");
        address.setPostalCode("560001");
        address.setAddressType("CURRENT");

        UserRequest request = new UserRequest();
        request.setFirstName("Rakshar");
        request.setLastName("Test");
        request.setEmail("test@gmail.com");
        request.setAddresses(List.of(address));

        // Mock response
        when(userService.createUser(Mockito.any()))
                .thenReturn("Saved");

        // Call controller
        ResponseEntity<String> response = controller.createUser(request);

        // Assert
        assertEquals("Saved", response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}