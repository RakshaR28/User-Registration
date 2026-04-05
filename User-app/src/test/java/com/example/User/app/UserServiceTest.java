package com.example.User.app;

import com.example.User.app.dto.AddressRequest;
import com.example.User.app.dto.UserRequest;
import com.example.User.app.entity.User;
import com.example.User.app.repository.UserRepository;
import com.example.User.app.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser_withAddresses() {

        // ✅ Prepare request with nested addresses
        AddressRequest current = new AddressRequest();
        current.setAddressLine1("Line1");
        current.setCity("Bangalore");
        current.setState("KA");
        current.setCountryCode("IN");
        current.setPostalCode("560001");
        current.setAddressType("CURRENT");

        AddressRequest permanent = new AddressRequest();
        permanent.setAddressLine1("Line2");
        permanent.setCity("Mysore");
        permanent.setState("KA");
        permanent.setCountryCode("IN");
        permanent.setPostalCode("570001");
        permanent.setAddressType("PERMANENT");

        UserRequest request = new UserRequest();
        request.setFirstName("Raksha");
        request.setLastName("Test");
        request.setEmail("test@gmail.com");
        request.setAddresses(List.of(current, permanent));

        // ✅ Mock repository save
        User savedUser = new User();
        savedUser.setUserId(1L);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // ✅ Call service
        String result = userService.createUser(request);

        // ✅ Assertions
        assertEquals("User saved successfully", result);
        assertNotNull(savedUser.getUserId());

        // ✅ Verify save called once
        verify(userRepository, times(1)).save(any(User.class));
    }
}