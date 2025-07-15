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
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotNull(message = "Title is required") Map<String, String> getTitle() {
        return title;
    }

    public void setTitle(@NotNull(message = "Title is required") Map<String, String> title) {
        this.title = title;
    }

    public @NotNull(message = "Description is required") Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(@NotNull(message = "Description is required") Map<String, String> description) {
        this.description = description;
    }

    public @NotNull(message = "Price is required") @Positive(message = "Price must be positive") Double getPrix() {
        return prix;
    }

    public void setPrix(@NotNull(message = "Price is required") @Positive(message = "Price must be positive") Double prix) {
        this.prix = prix;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public @Positive(message = "Duration must be positive") @NotNull(message = "Duration is required") Integer getDuree() {
        return duree;
    }

    public void setDuree(@Positive(message = "Duration must be positive") @NotNull(message = "Duration is required") Integer duree) {
        this.duree = duree;
    }

    public @NotNull(message = "Trainer name is required") String getNomFormateur() {
        return nomFormateur;
    }

    public void setNomFormateur(@NotNull(message = "Trainer name is required") String nomFormateur) {
        this.nomFormateur = nomFormateur;
    }

    public @NotNull(message = "State is required") Map<String, String> getEtat() {
        return etat;
    }

    public void setEtat(@NotNull(message = "State is required") Map<String, String> etat) {
        this.etat = etat;
    }

    public @NotNull(message = "Level is required") Map<String, String> getNiveau() {
        return niveau;
    }

    public void setNiveau(@NotNull(message = "Level is required") Map<String, String> niveau) {
        this.niveau = niveau;
    }

    public Map<String, String> getPrerequis() {
        return prerequis;
    }

    public void setPrerequis(Map<String, String> prerequis) {
        this.prerequis = prerequis;
    }

    public Map<String, String> getProgramme() {
        return programme;
    }

    public void setProgramme(Map<String, String> programme) {
        this.programme = programme;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public Integer getPlacesDisponibles() {
        return placesDisponibles;
    }

    public void setPlacesDisponibles(Integer placesDisponibles) {
        this.placesDisponibles = placesDisponibles;
    }

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
