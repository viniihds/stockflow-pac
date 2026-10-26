# ---- Etapa 1: build -------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Baixa as dependencias primeiro (aproveita o cache do Docker)
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q package -DskipTest

# ---- Etapa 2: runtime -----------------------------------------------------
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Perfil de producao: exige JWT_SECRET definido (ver application-prod.properties)
ENV SPRING_PROFILES_ACTIVE=prod
# Instancia gratuita do Render tem 512 MB de RAM: limita o heap da JVM
ENV JAVA_OPTS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC"

# O Render define PORT automaticamente; a aplicacao le essa variavel.
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
