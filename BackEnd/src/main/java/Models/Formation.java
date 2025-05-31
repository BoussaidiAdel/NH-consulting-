package Models;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Formation")
public class Formation {

    @Id
    private String id;

    @NotNull(message = "Title is required")
    private Map<String, String> title;

    @NotNull(message = "Description is required")
    private Map<String, String> description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double prix;

    private String image;

    @Positive(message = "Duration must be positive")
    @NotNull(message = "Duration is required")
    private Integer duree;

    @NotNull(message = "Trainer name is required")
    private String nomFormateur;

    @NotNull(message = "State is required")
    private Map<String, String> etat;

    @NotNull(message = "Level is required")
    private Map<String, String> niveau;

    private Map<String, String> prerequis;
    private Map<String, String> programme;

    private Boolean active;
    private String dateDebut;
    private String dateFin;
    private Integer placesDisponibles;
}
