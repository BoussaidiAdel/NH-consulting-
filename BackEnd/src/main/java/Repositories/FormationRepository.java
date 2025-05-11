package Repositories;

import Models.Formation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormationRepository extends MongoRepository<Formation, String> {

    // Custom query to find formations by their 'etat' (online or in-person)
    List<Formation> findByEtat(String etat);

    // Custom query to find formations by their 'niveau' (beginner, intermediate, advanced)
    List<Formation> findByNiveau(String niveau);

    // Search formations by title or description
    List<Formation> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    // Find formations by price range
    List<Formation> findByPrixBetween(Double minPrice, Double maxPrice);

    // Find formations by duration range
    List<Formation> findByDureeBetween(Integer minDuration, Integer maxDuration);

    // Find formations by trainer name
    List<Formation> findByNomFormateurContainingIgnoreCase(String nomFormateur);

    // Find formations by available places
    List<Formation> findByPlacesDisponiblesGreaterThan(Integer places);
}