package Repositories;

import Models.Formation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
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

    // Find formations by trainer name
    List<Formation> findByNomFormateurContainingIgnoreCase(String nomFormateur);

    // Find formations by available places
    List<Formation> findByPlacesDisponiblesGreaterThan(Integer places);

    @Query("{ 'etat': { $elemMatch: { $eq: ?0 } } }")
    List<Formation> findByEtatValue(String etatValue);

    // Find formations where any value in niveau map equals the given string
    @Query("{ 'niveau': { $elemMatch: { $eq: ?0 } } }")
    List<Formation> findByNiveauValue(String niveauValue);

    // Search formations where any value in title or description maps contain keyword (case insensitive)
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Formation> findByTitleValueContainingIgnoreCaseOrDescriptionValueContainingIgnoreCase(String titleKeyword, String descriptionKeyword);

    List<Formation> findByPrixBetween(Double min, Double max);

    List<Formation> findByDureeBetween(Integer min, Integer max);
}