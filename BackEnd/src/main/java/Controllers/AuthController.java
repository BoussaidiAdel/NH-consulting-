package Controllers;

import Dtos.LoginRequest;
import Dtos.LoginResponse;
import Exceptions.JwtException;
import Models.RegisterUser;
import Models.User;
import Services.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterUser user) {
        try {
            log.info("Attempting to register user: {}", user.getEmail());
            User registeredUser = authService.register(user);
            log.info("User registered successfully: {}", registeredUser.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (IllegalArgumentException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "registration_failed", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "server_error", "message", "Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Attempting to log in user: {}", loginRequest.getEmail());
            ResponseEntity<LoginResponse> response = authService.loginAndGenerateResponse(loginRequest);
            log.info("User logged in successfully: {}", loginRequest.getEmail());
            return response;
        } catch (IllegalArgumentException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "authentication_failed", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "server_error", "message", "Login failed"));
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        log.info("Received password reset request for email: {}", email);

        try {
            authService.forgotPassword(email);

            Map<String, String> response = Map.of(
                    "message", "Password reset instructions sent to your email."
            );

            log.info("Password reset instructions sent to email: {}", email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Password reset request failed: {}", e.getMessage());

            Map<String, String> response = Map.of(
                    "error", "not_found",
                    "message", e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            log.error("System error occurred while processing password reset", e);

            Map<String, String> response = Map.of(
                    "error", "server_error",
                    "message", "An unexpected error occurred. Please try again later."
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        try {
            ResponseEntity<LoginResponse> response = authService.refreshTokens(request);
            return response;
        } catch (JwtException e) {
            log.error("Refresh token error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getErrorCode(), "message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Refresh token error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_token", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Refresh token error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_token", "message", "Invalid refresh token"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseEntity<?> response = authService.logout();
        return response;
    }
}