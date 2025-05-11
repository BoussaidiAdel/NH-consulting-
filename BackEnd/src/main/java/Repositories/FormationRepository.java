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
}