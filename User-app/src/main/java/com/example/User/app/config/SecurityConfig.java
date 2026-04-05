package com.example.User.app.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for simplicity in APIs
                .csrf(csrf -> csrf.disable())
                // Authorize requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/**").permitAll() // allow your API
                        .anyRequest().permitAll()                // allow everything else too
                )
                // Disable default login form
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
