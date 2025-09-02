# ================================
# STEP 1: Build the Spring Boot JAR
# ================================
FROM maven:3.9.9-eclipse-temurin-17 AS build

# Copy source code into the container
COPY . .

# Package the application (skip tests for faster build)
RUN mvn clean package -DskipTests

# ================================
# STEP 2: Run the Spring Boot app
# ================================
FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
