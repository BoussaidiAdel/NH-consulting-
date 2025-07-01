// UserController.java
package Controllers;

import Models.User;
import Services.AuthService;
import Services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")

public class UserController {


    private static final org.slf4j.Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable String userId,
            @RequestBody User userUpdates) {
        try {
            log.info("Attempting to update user: {}", userId);
            User updatedUser = authService.updateUserInfo(userId, userUpdates);
            log.info("User updated successfully: {}", userId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Update failed for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDetails(@PathVariable String userId) {
        try {
            log.info("Fetching user: {}", userId);
            User user = userService.getUserInfo(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error fetching user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUserDetails() {
        try {
            log.info("Fetching all users");
            List<User> users = userService.getAllUserInfo();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching users");
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUserDetails(@PathVariable String userId) {
        try {
            log.info("Deleting user: {}", userId);
            userService.deleteUserInfo(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
        }
    }
}