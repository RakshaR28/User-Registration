package com.example.User.app.service;

import com.example.User.app.dto.AddressResponse;
import com.example.User.app.dto.UserRequest;
import com.example.User.app.dto.UserResponse;
import com.example.User.app.entity.Address;
import com.example.User.app.entity.User;
import com.example.User.app.repository.AddressRepository;
import com.example.User.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    // ✅ CREATE USER
    @Transactional
    public String createUser(UserRequest request) {

        log.info("Incoming request: {}", request);

        // Basic validation
        if (request.getFirstName() == null || request.getLastName() == null) {
            throw new RuntimeException("Invalid input");
        }

        // Create User
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail().toLowerCase()); // IMPORTANT

        // Map addresses
        List<Address> addressList = request.getAddresses().stream().map(addrReq -> {
            Address addr = new Address();
            addr.setAddressLine1(addrReq.getAddressLine1());
            addr.setCity(addrReq.getCity());
            addr.setState(addrReq.getState());
            addr.setCountryCode(addrReq.getCountryCode());
            addr.setPostalCode(addrReq.getPostalCode());
            addr.setAddressType(addrReq.getAddressType());

            addr.setUser(user); // VERY IMPORTANT
            return addr;
        }).toList();

        user.setAddresses(addressList);

        userRepository.save(user);

        log.info("User + Addresses saved successfully");

        return "User saved successfully";
    }

    // ✅ FETCH USERS
   /* public List<UserResponse> getAllUsers() {

        return userRepository.findTop5ByOrderByIdDesc()
                .stream()
                .map(user -> {
                    UserResponse res = new UserResponse();
                    res.setFirstName(user.getFirstName());
                    res.setLastName(user.getLastName());
                    res.setEmail(user.getEmail());

                    if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {

                        user.getAddresses().forEach(addr -> {
                            if ("CURRENT".equals(addr.getAddressType())) {
                                res.setCurrentAddress(addr.getAddressLine1());
                            } else if ("PERMANENT".equals(addr.getAddressType())) {
                                res.setPermanentAddress(addr.getAddressLine1());
                            }
                        });
                    }

                    return res;
                })
                .toList();
    }
    public List<User> getLatestUsers() {
        return userRepository.findTop5ByOrderByUserIdDesc();
    }*/
    public List<UserResponse> getLatestUsers() {

        return userRepository.findTop5ByOrderByUserIdDesc()
                .stream()
                .map(user -> {
                    UserResponse res = new UserResponse();

                    res.setUserId(user.getUserId());
                    res.setFirstName(user.getFirstName());
                    res.setLastName(user.getLastName());
                    res.setEmail(user.getEmail());

                    if (user.getAddresses() != null) {
                        List<AddressResponse> addressResponses = user.getAddresses()
                                .stream()
                                .map(addr -> {
                                    AddressResponse ar = new AddressResponse();
                                    ar.setAddressLine1(addr.getAddressLine1());
                                    ar.setCity(addr.getCity());
                                    ar.setState(addr.getState());
                                    ar.setCountryCode(addr.getCountryCode());
                                    ar.setPostalCode(addr.getPostalCode());
                                    ar.setAddressType(addr.getAddressType());
                                    return ar;
                                })
                                .toList();

                        res.setAddresses(addressResponses);
                    }

                    return res;
                })
                .toList();
    }
}