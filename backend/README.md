# Smart Event Management - Java Spring Boot Backend

Production-ready Java REST API Backend built with **Java 17+**, **Spring Boot 3**, **Spring Security (JWT)**, **Spring Data JPA**, **ZXing**, **Apache POI**, and **OpenPDF**.

---

## 🛠️ Tech Stack & Dependencies
- **Java**: 17+ (or 21 LTS)
- **Framework**: Spring Boot 3.2.3
- **Build Tool**: Apache Maven (`pom.xml`)
- **Security**: Spring Security 6 + JJWT
- **Database**: H2 Database (zero config, file-backed in `./data/event_db`)
- **QR Code**: ZXing 3.5
- **Exporting**: Apache POI (Excel) & OpenPDF (PDF)

---

## 🚀 How to Run Locally

### Option 1: Using Maven Command Line
```bash
cd backend-java
mvn spring-boot:run
```

### Option 2: Using IDE (IntelliJ IDEA / VS Code / Eclipse)
1. Open the project folder `backend-java` in your IDE.
2. Select Java SDK 17+.
3. Run `com.smartevent.SmartEventApplication`.

The server will start on port `5000` (`http://localhost:5000`).

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User Authentication & JWT generation |
| `POST` | `/api/auth/register` | User Registration |
| `GET` | `/api/auth/me` | Fetch Current Authenticated Profile |
| `GET` | `/api/events` | List all events |
| `GET` | `/api/events/active` | List active events |
| `POST` | `/api/tickets/register` | Book ticket & generate QR code |
| `GET` | `/api/tickets/my-tickets` | List user's booked tickets |
| `POST` | `/api/scanner/scan` | Validate QR ticket code at gate |
| `GET` | `/api/crowd/live/{id}` | Live crowd density metrics |
| `GET` | `/api/analytics/dashboard-stats` | Dashboard KPIs & stats |
| `GET` | `/api/reports/attendance/pdf` | Export Attendance PDF |
| `GET` | `/api/reports/attendance/excel` | Export Attendance Excel |

---

## 🔑 Default Seed Credentials
- **Admin**: `admin@smartjira.com` / `admin123`
- **Visitor**: `visitor@example.com` / `visitor123`
