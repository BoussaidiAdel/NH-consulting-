package Services;

import Dtos.ContactRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${contact.email.recipient}")
    private String toEmail;

    @Value("${contact.email.subject.prefix:Contact Form:}")
    private String subjectPrefix;

    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendContactEmail(ContactRequest contactRequest) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setReplyTo(contactRequest.getEmail());
            helper.setSubject(subjectPrefix + " " + contactRequest.getSubject());


            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("fullname", contactRequest.getFullname());
            variables.put("email", contactRequest.getEmail());
            variables.put("phone", contactRequest.getPhone());
            variables.put("subject", contactRequest.getSubject());
            variables.put("message", contactRequest.getMessage());
            context.setVariables(variables);


            String emailContent = templateEngine.process("contact-email", context);
            helper.setText(emailContent, true);

            mailSender.send(message);

            logger.info("Contact email sent successfully to: {}", toEmail);

            // Send confirmation email to the user
            sendConfirmationEmail(contactRequest);

        } catch (MessagingException e) {
            logger.error("Failed to send contact email", e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendConfirmationEmail(ContactRequest contactRequest) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(contactRequest.getEmail());
            helper.setSubject("Thank you for contacting us");

            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("fullname", contactRequest.getFullname());
            context.setVariables(variables);

            String emailContent = templateEngine.process("contact-confirmation.html", context);
            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("Confirmation email sent to: {}", contactRequest.getEmail());

        } catch (MessagingException e) {
            logger.error("Failed to send confirmation email", e);
            // Don't rethrow - this is a secondary email and shouldn't affect the main flow
        }
    }
    @Async
    public void sendFormationSubscriptionConfirmationEmail(String userEmail, String firstName, String formationTitle,
                                                          String lastName, String phone, String address, String educationLevel,
                                                          Integer age, String studentClass) {
        try {
            // Confirmation email to the user
            MimeMessage userMessage = mailSender.createMimeMessage();
            MimeMessageHelper userHelper = new MimeMessageHelper(userMessage, true, "UTF-8");
            userHelper.setFrom(fromEmail);
            userHelper.setTo(userEmail);
            userHelper.setSubject("Confirmation d'inscription à la formation");

            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("firstName", firstName);
            variables.put("lastName", lastName);
            variables.put("phone", phone);
            variables.put("address", address);
            variables.put("educationLevel", educationLevel);
            variables.put("age", age);
            variables.put("studentClass", studentClass);
            variables.put("formationTitle", formationTitle);
            context.setVariables(variables);

            String emailContent = templateEngine.process("formation-subscription-confirmation.html", context);
            userHelper.setText(emailContent, true);
            mailSender.send(userMessage);
            logger.info("Confirmation email sent to: {}", userEmail);

            // Notification email to the admin/recipient
            MimeMessage adminMessage = mailSender.createMimeMessage();
            MimeMessageHelper adminHelper = new MimeMessageHelper(adminMessage, true, "UTF-8");
            adminHelper.setFrom(fromEmail);
            adminHelper.setTo(toEmail);
            adminHelper.setSubject("Nouvelle inscription à une formation");
            adminHelper.setText(emailContent, true); // reuse the same content
            mailSender.send(adminMessage);
            logger.info("Notification email sent to admin: {}", toEmail);

        } catch (MessagingException e) {
            logger.error("Failed to send formation subscription confirmation or admin notification email", e);
            // Ne pas rethrow pour ne pas casser le flux principal
        }
    }

}