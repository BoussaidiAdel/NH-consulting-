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

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUser {

    @NotEmpty(message = "First name is required")
    private String firstName;

    @NotEmpty(message = "Last name is required")
    private String lastName;

    @NotEmpty(message = "Email is required")
    @MinotoreEmail(message = "Email must end with @minotore.com")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;

}



@Documented
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MinotoreEmailValidator.class)
@interface MinotoreEmail {
    String message() default "Invalid email";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}

class MinotoreEmailValidator implements ConstraintValidator<MinotoreEmail, String> {

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return email != null && email.toLowerCase().endsWith("@minotore.com");
    }
}