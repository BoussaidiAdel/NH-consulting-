package Models;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.annotation.*;
import java.util.regex.Pattern;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUser {
    public @NotEmpty(message = "First name is required") String getFirstName() {
        return firstName;
    }

    public void setFirstName(@NotEmpty(message = "First name is required") String firstName) {
        this.firstName = firstName;
    }

    public @NotEmpty(message = "Last name is required") String getLastName() {
        return lastName;
    }

    public void setLastName(@NotEmpty(message = "Last name is required") String lastName) {
        this.lastName = lastName;
    }

    public @NotEmpty(message = "Email is required") String getEmail() {
        return email;
    }

    public void setEmail(@NotEmpty(message = "Email is required") String email) {
        this.email = email;
    }

    public @NotEmpty(message = "Password is required") String getPassword() {
        return password;
    }

    public void setPassword(@NotEmpty(message = "Password is required") String password) {
        this.password = password;
    }

    @NotEmpty(message = "First name is required")
    private String firstName;

    @NotEmpty(message = "Last name is required")
    private String lastName;

    @NotEmpty(message = "Email is required")
    @ValidEmail(message = "Please provide a valid email address")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;
}

@Documented
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmailValidator.class)
@interface ValidEmail {
    String message() default "Invalid email";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

class EmailValidator implements ConstraintValidator<ValidEmail, String> {
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) {
            return false;
        }
        return Pattern.compile(EMAIL_PATTERN).matcher(email).matches();
    }
}