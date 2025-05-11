package Services;

import Models.Formation;
import Repositories.FormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormationService {


    @Autowired
    private FormationRepository formationRepository;

    // Create or update a formation
    public Formation saveFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    // Get all formations
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    // Get formation by ID
    public Optional<Formation> getFormationById(String id) {
        return formationRepository.findById(id);
    }

    // Delete a formation by ID
    public void deleteFormation(String id) {
        formationRepository.deleteById(id);
    }

    // Get formations by their 'etat' (online or in-person)
    public List<Formation> getFormationsByEtat(String etat) {
        return formationRepository.findByEtat(etat);
    }

    // Get formations by their 'niveau' (beginner, intermediate, advanced)
    public List<Formation> getFormationsByNiveau(String niveau) {
        return formationRepository.findByNiveau(niveau);
    }
}
