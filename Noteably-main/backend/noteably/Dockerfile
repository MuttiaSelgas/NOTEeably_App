# Step 1: Build the app
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy everything and build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run the app
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the built JAR from the builder
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (important for Railway)
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
