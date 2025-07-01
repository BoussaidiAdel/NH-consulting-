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

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/public/contact")
@Validated  

public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final EmailService emailService;

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
}