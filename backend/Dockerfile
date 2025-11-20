FROM eclipse-temurin:21

ARG PORT

WORKDIR /app

COPY . .

EXPOSE ${PORT}

CMD ["./mvnw", "spring-boot:run"]