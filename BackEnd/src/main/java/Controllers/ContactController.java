package Controllers;

import Dtos.ContactRequest;
import Dtos.ContactResponse;
import Services.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import Models.Inscri;
import Services.InscriptionService;
import Services.FormationService;
import Models.Formation;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/public/contact")
@Validated  

public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final EmailService emailService;

    @Autowired
    private InscriptionService inscriptionService;

    @Autowired
    private FormationService formationService;

    @Autowired
    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<ContactResponse> sendContactEmail(@Valid @RequestBody ContactRequest request) {
        logger.info("Received contact form submission from: {}", request.getEmail());

 try {
            emailService.sendContactEmail(request);

            ContactResponse response = new ContactResponse(true, "Your message has been sent successfully!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to send contact email", e);

            ContactResponse response = new ContactResponse(false, "Failed to send your message. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/subscribe")
    public ResponseEntity<ContactResponse> subscribeToFormation(@RequestBody Inscri inscription) {
        if (inscription.getFormationId() == null || inscription.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ContactResponse(false, "formationId or email is missing"));
        }
        inscription.setDateInscription(java.time.LocalDate.now().toString());
        // inscriptionService.saveInscription(inscription); // Removed: do not store subscription

        // Retrieve the formation title for the email
        Optional<Formation> formationOpt = formationService.getFormationById(inscription.getFormationId());
        String formationTitle = formationOpt.map(f -> f.getTitle().getOrDefault("fr", "formation"))
                .orElse("formation");
        
        // Set formationTitle in the inscription object
        inscription.setFormationTitle(formationTitle);

        emailService.sendFormationSubscriptionConfirmationEmail(
                inscription.getEmail(),
                inscription.getFirstName(),
                formationTitle,
                inscription.getLastName(),
                inscription.getPhone(),
                inscription.getAddress(),
                inscription.getEducationLevel(),
                inscription.getAge(),
                inscription.getStudentClass()
        );

        return ResponseEntity.ok(new ContactResponse(true, "Inscription réussie et email envoyé"));
    }
}