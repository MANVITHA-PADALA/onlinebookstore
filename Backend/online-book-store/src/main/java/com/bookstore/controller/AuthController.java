package com.bookstore.controller;
import com.bookstore.model.User;
import com.bookstore.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User foundUser = userService.findByEmail(user.getEmail());
        if (foundUser != null && foundUser.getPassword().equals(user.getPassword())) {
            return "Login Successful"; // Implement JWT or session management
        }
        return "Invalid credentials";
    }

    @PostMapping("/register")
    public void register(@Valid @RequestBody User user) {
        userService.save(user);
    }
}
