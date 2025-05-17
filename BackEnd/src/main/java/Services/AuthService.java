package Services;

import Dtos.LoginRequest;
import Dtos.LoginResponse;
import Exceptions.EmailAlreadyExistsException;
import Exceptions.JwtExpiredException;
import Exceptions.JwtInvalidException;
import Exceptions.JwtMissingException;
import Models.RegisterUser;
import Models.Role;
import Models.User;
import Repositories.UserRepository;
import Utils.JwtService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${jwt.access-token-expiration}")
    private int accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private int refreshTokenExpiration;

    @Transactional
    public User register(RegisterUser registerUser) {
        if (registerUser.getEmail() == null || registerUser.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        if (userRepository.existsByEmail(registerUser.getEmail())) {
            throw new EmailAlreadyExistsException(registerUser.getEmail());
        }

        User user = new User();
        user.setFirstName(registerUser.getFirstName());
        user.setLastName(registerUser.getLastName());
        user.setEmail(registerUser.getEmail());
        user.setPassword(passwordEncoder.encode(registerUser.getPassword()));
        user.setRole(Role.USER);
        user.setVerified(false);

        return userRepository.save(user);
    }

    public User login(LoginRequest loginRequest) {
        User dbUser = userRepository.findByEmail(loginRequest.getEmail());
        if (dbUser == null) {
            throw new IllegalArgumentException("User not registered");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        if (!dbUser.isVerified()) {
            throw new IllegalArgumentException("Account not verified");
        }

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        return dbUser;
    }

    public ResponseEntity<LoginResponse> loginAndGenerateResponse(LoginRequest loginRequest) {
        User user = login(loginRequest);

        String accessToken = jwtService.generateToken(user.getEmail(), false);
        String refreshToken = jwtService.generateToken(user.getEmail(), true);

        // Set HttpOnly cookies
        ResponseCookie accessTokenCookie = createAccessTokenCookie(accessToken);
        ResponseCookie refreshTokenCookie = createRefreshTokenCookie(refreshToken);

        LoginResponse loginResponse = new LoginResponse(user.getId(), user.getRole());

        return ResponseEntity.ok()
                .headers(headers -> {
                    headers.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
                    headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
                })
                .body(loginResponse);
    }

    public ResponseEntity<LoginResponse> refreshTokens(HttpServletRequest request) {
        // Extract refresh token from cookie
        String refreshToken = extractRefreshTokenFromCookies(request);

        if (refreshToken == null) {
            throw new JwtMissingException();
        }

        try {
            // Validate token
            if (!jwtService.isTokenValid(refreshToken)) {
                // isTokenValid will throw the appropriate exception
                throw new JwtInvalidException("Invalid refresh token");
            }

            // Extract user information
            String email = jwtService.extractEmail(refreshToken);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                throw new IllegalArgumentException("User not found");
            }

            // Generate new tokens
            String newAccessToken = jwtService.generateToken(email, false);
            String newRefreshToken = jwtService.generateToken(email, true);

            // Create cookies
            ResponseCookie accessTokenCookie = createAccessTokenCookie(newAccessToken);
            ResponseCookie refreshTokenCookie = createRefreshTokenCookie(newRefreshToken);

            // Create response object
            LoginResponse response = new LoginResponse(user.getId(), user.getRole());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                    .body(response);

        } catch (JwtExpiredException e) {
            // Re-throw to be handled properly in controller
            throw e;
        } catch (JwtInvalidException e) {
            // Re-throw to be handled properly in controller
            throw e;
        }
    }

    private String extractRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> "refresh_token".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

    private ResponseCookie createAccessTokenCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(accessTokenExpiration)
                .build();
    }

    private ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .sameSite("None")
                .maxAge(refreshTokenExpiration)
                .build();
    }

    public ResponseEntity<?> logout() {
        ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(0)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .sameSite("None")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(Map.of("message", "Logged out successfully"));
    }

    public User updateUserInfo(String userId, User user) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }

        if (user.getPassword() != null) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        if (user.getFirstName() != null) {
            existingUser.setFirstName(user.getFirstName());
        }

        if (user.getLastName() != null) {
            existingUser.setLastName(user.getLastName());
        }

        return userRepository.save(existingUser);
    }

    @Async
    public void forgotPassword(String email) throws MessagingException {
        // Validate email input
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        // Check if user exists
        User user = userRepository.findByEmail(email.trim());
        if (user == null) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }

        // Check if user is active/verified
        if (!user.isVerified()) {
            throw new IllegalArgumentException("User account is not verified");
        }

        // Generate reset token
        String resetToken = jwtService.generateToken(email, false);
        String resetLink = "http://localhost:4200" + "/reset-password?token=" + resetToken;

        try {
            // Prepare Thymeleaf context
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("firstname", sanitizeHtmlOutput(user.getFirstName()));
            variables.put("lastname", sanitizeHtmlOutput(user.getLastName()));
            variables.put("resetLink", resetLink);
            context.setVariables(variables);

            // Process email template
            String emailContent = templateEngine.process("password-reset", context);

            // Prepare and send email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Password Reset Request");
            helper.setText(emailContent, true);

            mailSender.send(message);

            // Log the password reset request
            logger.info("Password reset link generated for email: {}", email);

        } catch (Exception e) {
            logger.error("Error sending password reset email to: {}", email, e);
            throw new MessagingException("Failed to send password reset email", e);
        }
    }

    /**
     * Sanitize HTML output to prevent XSS
     * @param input Input string to sanitize
     * @return Sanitized string
     */
    private String sanitizeHtmlOutput(String input) {
        if (input == null) return "";
        return input.replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("&", "&amp;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}