# Use an official Maven image to build the app
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Use a lightweight JRE image to run the app
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Set production environment variables for CORS and reset link base
ENV SPRING_PROFILES_ACTIVE=prod
ENV app.cors.allowed-origin-prod=http://51.75.27.103:4200
ENV app.reset-link-base-prod=http://51.75.27.103:4200
ENTRYPOINT ["java", "-jar", "app.jar"] 