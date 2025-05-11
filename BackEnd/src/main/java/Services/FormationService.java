package Services;

import Models.Formation;
import Repositories.FormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Optional;

@Service
public class FormationService {

    @Autowired
    private FormationRepository formationRepository;

    // Create or update a formation
    public Formation saveFormation(Formation formation) {
        validateFormation(formation);
        return formationRepository.save(formation);
    }

    public List<Formation> getAllFormations(String sortBy) {
        if (sortBy != null && !sortBy.isEmpty()) {
            return formationRepository.findAll(Sort.by(Sort.Direction.ASC, sortBy));
        }
        return formationRepository.findAll();
    }

    // Get formation by ID
    public Optional<Formation> getFormationById(String id) {
        return formationRepository.findById(id);
    }

    // Delete a formation by ID
    public void deleteFormation(String id) {
        if (!formationRepository.existsById(id)) {
            throw new RuntimeException("Formation not found with id: " + id);
        }
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

    // Search formations by title or description
    public List<Formation> searchFormations(String keyword) {
        return formationRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    // Get formations by price range
    public List<Formation> getFormationsByPriceRange(Double minPrice, Double maxPrice) {
        return formationRepository.findByPrixBetween(minPrice, maxPrice);
    }

    // Get formations by duration range
    public List<Formation> getFormationsByDurationRange(Integer minDuration, Integer maxDuration) {
        return formationRepository.findByDureeBetween(minDuration, maxDuration);
    }

    // Validate formation data
    private void validateFormation(Formation formation) {
        if (formation.getTitle() == null || formation.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Formation title cannot be empty");
        }
        if (formation.getDescription() == null || formation.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Formation description cannot be empty");
        }
        if (formation.getPrix() == null || formation.getPrix() <= 0) {
            throw new IllegalArgumentException("Formation price must be positive");
        }
        if (formation.getDuree() == null || formation.getDuree() <= 0) {
            throw new IllegalArgumentException("Formation duration must be positive");
        }
        if (formation.getNomFormateur() == null || formation.getNomFormateur().trim().isEmpty()) {
            throw new IllegalArgumentException("Trainer name cannot be empty");
        }
        if (formation.getEtat() == null || formation.getEtat().trim().isEmpty()) {
            throw new IllegalArgumentException("Formation state cannot be empty");
        }
        if (formation.getNiveau() == null || formation.getNiveau().trim().isEmpty()) {
            throw new IllegalArgumentException("Formation level cannot be empty");
        }
    }
}
