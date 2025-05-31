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

    public Optional<Formation> getFormationById(String id) {
        return formationRepository.findById(id);
    }

    public void deleteFormation(String id) {
        if (!formationRepository.existsById(id)) {
            throw new RuntimeException("Formation not found with id: " + id);
        }
        formationRepository.deleteById(id);
    }

    // Since etat and niveau are maps, you should search by a value inside the map,
    // e.g., find formations where etat map contains a value matching the parameter.
    public List<Formation> getFormationsByEtat(String etatValue) {
        return formationRepository.findByEtatValue(etatValue);
    }

    public List<Formation> getFormationsByNiveau(String niveauValue) {
        return formationRepository.findByNiveauValue(niveauValue);
    }

    public List<Formation> searchFormations(String keyword) {
        return formationRepository.findByTitleValueContainingIgnoreCaseOrDescriptionValueContainingIgnoreCase(keyword, keyword);
    }

    public List<Formation> getFormationsByPriceRange(Double minPrice, Double maxPrice) {
        return formationRepository.findByPrixBetween(minPrice, maxPrice);
    }

    public List<Formation> getFormationsByDurationRange(Integer minDuration, Integer maxDuration) {
        return formationRepository.findByDureeBetween(minDuration, maxDuration);
    }

    private void validateFormation(Formation formation) {
        if (formation.getTitle() == null || formation.getTitle().isEmpty() || formation.getTitle().values().stream().allMatch(String::isBlank)) {
            throw new IllegalArgumentException("Formation title cannot be empty");
        }
        if (formation.getDescription() == null || formation.getDescription().isEmpty() || formation.getDescription().values().stream().allMatch(String::isBlank)) {
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
        if (formation.getEtat() == null || formation.getEtat().isEmpty() || formation.getEtat().values().stream().allMatch(String::isBlank)) {
            throw new IllegalArgumentException("Formation state cannot be empty");
        }
        if (formation.getNiveau() == null || formation.getNiveau().isEmpty() || formation.getNiveau().values().stream().allMatch(String::isBlank)) {
            throw new IllegalArgumentException("Formation level cannot be empty");
        }
    }
}
