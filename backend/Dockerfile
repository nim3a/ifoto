# Multi-stage build for Spring Boot backend
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/ifoto-backend-*.jar app.jar

# Create non-root user
RUN addgroup -S ifoto && adduser -S ifoto -G ifoto
USER ifoto

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
