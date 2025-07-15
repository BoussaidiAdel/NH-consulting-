package Services;

import Models.Inscri;
import Repositories.InscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    public Inscri saveInscription(Inscri inscription) {
        return inscriptionRepository.save(inscription);
    }

    public List<Inscri> getInscriptionsByFormationId(String formationId) {
        return inscriptionRepository.findByFormationId(formationId);
    }

    public Long countInscriptionsByFormationId(String formationId) {
        return inscriptionRepository.countByFormationId(formationId);
    }
}