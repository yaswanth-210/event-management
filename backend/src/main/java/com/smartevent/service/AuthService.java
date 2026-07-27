package com.smartevent.service;

import com.smartevent.config.JwtTokenProvider;
import com.smartevent.dto.AuthDTOs.*;
import com.smartevent.model.User;
import com.smartevent.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();
        String token = tokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());

        UserDTO userDTO = new UserDTO(
                user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getRole(), user.getPhotoUrl(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );

        return new AuthResponse(token, userDTO);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "visitor");

        User saved = userRepository.save(user);

        String token = tokenProvider.generateToken(saved.getEmail(), saved.getRole(), saved.getId());

        UserDTO userDTO = new UserDTO(
                saved.getId(), saved.getName(), saved.getEmail(),
                saved.getPhone(), saved.getRole(), saved.getPhotoUrl(),
                saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : null
        );

        return new AuthResponse(token, userDTO);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(
                user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getRole(), user.getPhotoUrl(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );
    }
}
