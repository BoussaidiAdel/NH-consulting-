package com.Boussaidi.NH.consulting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"Controllers","Repositories","Utils","Services","Models"})
@EnableMongoRepositories(basePackages = "Repositories")
public class NhConsultingApplication {

	public static void main(String[] args) {
		SpringApplication.run(NhConsultingApplication.class, args);
	}

}	
