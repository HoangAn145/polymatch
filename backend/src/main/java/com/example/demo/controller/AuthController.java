package com.example.demo.controller;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.TaxService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final TaxService taxService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Inject thêm TaxService vào Constructor
    public AuthController(UserRepository userRepository, TaxService taxService) {
        this.userRepository = userRepository;
        this.taxService = taxService;
    }

    // Endpoint tra cứu MST cho Frontend gọi
    @GetMapping("/tax-lookup/{taxCode}")
    public ResponseEntity<?> lookupTax(@PathVariable String taxCode) {
        Map<String, Object> taxData = taxService.lookupTaxCode(taxCode);
        if ((Boolean) taxData.get("valid")) {
            return ResponseEntity.ok(taxData);
        } else {
            return ResponseEntity.badRequest().body(taxData);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email đã tồn tại!"));
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        // Mã hóa mật khẩu BCrypt trước khi lưu vào Database
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "BUYER");

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Đăng ký tài khoản thành công!",
            "userId", user.getId()
        ));
    }
}