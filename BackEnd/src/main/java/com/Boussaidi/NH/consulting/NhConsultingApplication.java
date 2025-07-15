package com.Boussaidi.NH.consulting;

import Models.Role;
import Models.User;
import Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@ComponentScan(basePackages = {"Config","Controllers","Repositories","Utils","Services","Models","Exceptions"})
@EnableMongoRepositories(basePackages = "Repositories")
public class NhConsultingApplication {

	public static void main(String[] args) {
		SpringApplication.run(NhConsultingApplication.class, args);
	}

	@Bean
	public CommandLineRunner ensureAdminUser(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@nh-consultingbusiness.com";
			if (!userRepository.existsByEmail(adminEmail)) {
				User admin = new User();
				admin.setFirstName("Admin");
				admin.setLastName("NHConsulting");
				admin.setEmail(adminEmail);
				admin.setPassword(passwordEncoder.encode("nhconsulting8871"));
				admin.setRole(Role.ADMIN);
				admin.setVerified(true);
				userRepository.save(admin);
				System.out.println("Default admin user created: " + adminEmail + " / admin1234");
			} else {
				System.out.println("Admin user already exists: " + adminEmail);
			}
		};
	}
}	
