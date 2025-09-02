# Use official Maven + JDK image to build
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only backend folder (where pom.xml exists)
COPY EventPlanner\ application(spring+react)/EventPlanner-Backend/pom.xml .
COPY EventPlanner\ application(spring+react)/EventPlanner-Backend/src ./src

# Build the Spring Boot application (skip tests for faster CI/CD)
RUN mvn clean package -DskipTests

# --------------------------
# Run stage
# --------------------------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
