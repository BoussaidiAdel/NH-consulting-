    package Controllers;

    import Models.Formation;
    import Models.Inscri;
    import Services.EmailService;
    import Services.FormationService;
    import Services.InscriptionService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.Map;
    import java.util.Optional;

    @RestController
    @CrossOrigin(origins = "http://localhost:4200")
    @RequestMapping("/api/public/formations")
    public class FormationController {

        @Autowired
        private FormationService formationService;

        // Endpoint to get all formations
        @GetMapping
        public List<Formation> getAllFormations(String sortBy) {
            return formationService.getAllFormations(sortBy);
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
        @Autowired
        private InscriptionService inscriptionService;

        @Autowired
        private EmailService emailService;

        @PostMapping("/subscribe")
        public ResponseEntity<String> subscribe(@RequestBody Inscri inscription) {
            if (inscription.getFormationId() == null || inscription.getEmail() == null) {
                return new ResponseEntity<>("formationId ou email manquant", HttpStatus.BAD_REQUEST);
            }

            inscription.setDateInscription(java.time.LocalDate.now().toString());
            inscriptionService.saveInscription(inscription);

            // Récupérer le titre de la formation pour le mail
            Optional<Formation> formationOpt = formationService.getFormationById(inscription.getFormationId());
            String formationTitle = formationOpt.map(f -> f.getTitle().get("fr")) // ou autre langue
                    .orElse("formation");

            emailService.sendFormationSubscriptionConfirmationEmail(
                    inscription.getEmail(),
                    inscription.getFirstName(),
                    formationTitle
            );

            System.out.println("User " + inscription.getEmail() + " inscrit à la formation " + inscription.getFormationId());

            return new ResponseEntity<>("Inscription réussie et email envoyé", HttpStatus.OK);
        }

    }
