FROM golang:1.20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Note CGO_ENABLED=1 for SQLite support
RUN CGO_ENABLED=1 GOOS=linux go build -o task-service

# Create directory for database
RUN mkdir -p /app/data

EXPOSE 8080

# Make sure the binary is executable
RUN chmod +x task-service

CMD ["./task-service"]