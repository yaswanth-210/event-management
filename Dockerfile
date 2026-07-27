# Build Stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY backend/ ./backend/
WORKDIR /app/backend
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 5000
ENV PORT=5000

ENTRYPOINT ["java", "-jar", "app.jar"]
