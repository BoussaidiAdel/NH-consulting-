package Dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {
    public @NotBlank(message = "Full name is required") @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters") String getFullname() {
        return fullname;
    }

    public void setFullname(@NotBlank(message = "Full name is required") @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters") String fullname) {
        this.fullname = fullname;
    }

    public @Pattern(regexp = "^[0-9\\+\\-\\s\\(\\)]{0,20}$", message = "Invalid phone number format") String getPhone() {
        return phone;
    }

    public void setPhone(@Pattern(regexp = "^[0-9\\+\\-\\s\\(\\)]{0,20}$", message = "Invalid phone number format") String phone) {
        this.phone = phone;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") @Size(max = 254, message = "Email must be less than 254 characters") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") @Size(max = 254, message = "Email must be less than 254 characters") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Message is required") @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters") String getMessage() {
        return message;
    }

    public void setMessage(@NotBlank(message = "Message is required") @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters") String message) {
        this.message = message;
    }

    public @NotBlank(message = "Subject is required") @Size(min = 3, max = 150, message = "Subject must be between 3 and 150 characters") String getSubject() {
        return subject;
    }

    public void setSubject(@NotBlank(message = "Subject is required") @Size(min = 3, max = 150, message = "Subject must be between 3 and 150 characters") String subject) {
        this.subject = subject;
    }

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullname;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 254, message = "Email must be less than 254 characters")
    private String email;

    @Pattern(regexp = "^[0-9\\+\\-\\s\\(\\)]{0,20}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Subject is required")
    @Size(min = 3, max = 150, message = "Subject must be between 3 and 150 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;}