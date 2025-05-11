package Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;


@Data
@AllArgsConstructor
@org.springframework.data.mongodb.core.mapping.Document(collection = "Formation")
public class Formation {


    @Id
    private String id;
    private String title;
    private String description;
    private Double prix;
    private String image ;
    private Integer duree; // Durée en heures
    private String nomFormateur; // Nom du formateur
    private String etat; // En ligne ou présentiel
    private String niveau; // Niveau de la formation


    public void setId(String id) {
        this.id = id;
    }
}

