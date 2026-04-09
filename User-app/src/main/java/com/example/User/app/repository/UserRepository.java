package com.example.User.app.repository;


import com.example.User.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findTop5ByOrderByUserIdDesc();
     boolean existsByEmail(String email);
}
