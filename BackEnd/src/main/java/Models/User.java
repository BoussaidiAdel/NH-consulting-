package Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private Role role;

    private boolean verified;

    public String getRole() {
        return this.role != null ? this.role.name() : null;
    }


}
