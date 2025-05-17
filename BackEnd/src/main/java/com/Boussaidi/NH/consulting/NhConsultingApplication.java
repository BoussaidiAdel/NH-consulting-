package com.Boussaidi.NH.consulting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@ComponentScan(basePackages = {"Config","Controllers","Repositories","Utils","Services","Models","Exceptions"})
@EnableMongoRepositories(basePackages = "Repositories")
public class NhConsultingApplication {

	public static void main(String[] args) {
		SpringApplication.run(NhConsultingApplication.class, args);
	}

}	
