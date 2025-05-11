    package Controllers;

    import Models.Formation;
    import Services.FormationService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.Optional;

    @RestController
    @RequestMapping("/api/formations")
    public class FormationController {

        @Autowired
        private FormationService formationService;

        // Endpoint to get all formations
        @GetMapping
        public List<Formation> getAllFormations() {
            return formationService.getAllFormations();
        }

        // Endpoint to get formation by ID
        @GetMapping("/{id}")
        public ResponseEntity<Formation> getFormationById(@PathVariable String id) {
            Optional<Formation> formation = formationService.getFormationById(id);
            if (formation.isPresent()) {
                return new ResponseEntity<>(formation.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

        // Endpoint to create a new formation
        @PostMapping("/add")
        public ResponseEntity<Formation> createFormation(@RequestBody Formation formation) {
            Formation savedFormation = formationService.saveFormation(formation);
            return new ResponseEntity<>(savedFormation, HttpStatus.CREATED);
        }

        // Endpoint to update a formation
        @PutMapping("/{id}")
        public ResponseEntity<Formation> updateFormation(@PathVariable String id, @RequestBody Formation formation) {
            Optional<Formation> existingFormation = formationService.getFormationById(id);
            if (existingFormation.isPresent()) {
                formation.setId(id);
                Formation updatedFormation = formationService.saveFormation(formation);
                return new ResponseEntity<>(updatedFormation, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

        // Endpoint to delete a formation
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteFormation(@PathVariable String id) {
            Optional<Formation> formation = formationService.getFormationById(id);
            if (formation.isPresent()) {
                formationService.deleteFormation(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

        // Endpoint to get formations by their 'etat'
        @GetMapping("/etat/{etat}")
        public List<Formation> getFormationsByEtat(@PathVariable String etat) {
            return formationService.getFormationsByEtat(etat);
        }

        // Endpoint to get formations by their 'niveau'
        @GetMapping("/niveau/{niveau}")
        public List<Formation> getFormationsByNiveau(@PathVariable String niveau) {
            return formationService.getFormationsByNiveau(niveau);
        }
    }
