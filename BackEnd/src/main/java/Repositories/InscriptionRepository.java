package Repositories;

import Models.Inscri;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface InscriptionRepository extends MongoRepository<Inscri, String> {
    List<Inscri> findByFormationId(String formationId);
    Long countByFormationId(String formationId);
}
