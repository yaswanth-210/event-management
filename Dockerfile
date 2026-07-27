# Build Stage using official Maven image
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src

WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 5000
ENV PORT=5000

ENTRYPOINT ["java", "-jar", "app.jar"]
