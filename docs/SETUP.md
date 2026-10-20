# Local Setup & Environment Initialization Guide (SETUP.md) — PawPulse

**Project**: PawPulse Full-Stack Operations Platform  
**Target OS**: Windows, macOS, Linux  
**Author**: Lead Full-Stack Engineer & DevOps Specialist  

---

## 1. Prerequisites & Tooling Requirements

Before installing the project, verify that your machine has the following tools installed:

| Tool | Minimum Version | Verification Command | Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.18.0` | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | `>= 9.x` | `npm -v` | Included with Node.js |
| **Java JDK** | `>= 17.0.0` | `java -version` | [Adoptium Temurin 17](https://adoptium.net) |
| **Maven** | `>= 3.8.0` | `mvn -v` | [maven.apache.org](https://maven.apache.org) |
| **Git** | `>= 2.30.0` | `git --version` | [git-scm.com](https://git-scm.com) |
| **Python** *(Optional)* | `>= 3.10.0` | `python --version` | [python.org](https://python.org) |

---

## 2. Step-by-Step Installation

### Step 2.1: Clone the Repository
```powershell
git clone https://github.com/SohamPandey670/pawpulse.git
cd pawpulse
```

---

### Step 2.2: Frontend Installation & Local Dev

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install npm dependencies:
   ```powershell
   npm install
   ```
3. Create a local environment file `.env.local` *(optional)*:
   ```env
   # Connect to local Spring Boot API (or leave unset to use offline fallback)
   VITE_API_URL=http://localhost:8080
   ```
4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
5. Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

### Step 2.3: Backend Installation & Spring Boot Startup

1. Open a new terminal and navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Build the JAR package:
   ```powershell
   mvn clean package -DskipTests
   ```
3. Run the compiled Spring Boot application:
   ```powershell
   java -jar target/pawpulse-api-1.0.0.jar
   ```
4. By default, the application runs on port `8080` using the local in-memory H2 database and auto-seeds all clinics, vets, owners, and appointments.

---

### Step 2.4: Verification & Smoke Test

Open PowerShell and verify the backend health probe:
```powershell
curl http://localhost:8080/api/auth/health
```
**Expected Response**:
```json
{
  "service": "PawPulse API",
  "version": "1.0.0",
  "status": "UP"
}
```

Verify the root welcome endpoint:
```powershell
curl http://localhost:8080/
```
**Expected Response**:
```json
{
  "service": "PawPulse Pet Healthcare API",
  "status": "UP",
  "version": "1.0.0",
  "message": "Spring Boot backend is live and operational!"
}
```

---

## 3. Environment Variables Reference

### Frontend (`frontend/.env.local` or Vercel Environment Variables)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the Spring Boot backend API | `https://pawpulse-v1df.onrender.com` |

### Backend (`backend/src/main/resources/application.yml` or Render Environment Variables)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP port assigned dynamically by cloud provider | `8080` (Local) / `10000` (Render) |
| `DATABASE_URL` | JDBC URL for PostgreSQL connection | `jdbc:postgresql://host:5432/pawpulse` |
| `SPRING_PROFILES_ACTIVE` | Spring configuration profile | `prod` (PostgreSQL) / unset (H2) |
| `JWT_SECRET` | 256-bit secret key for signing tokens | `PawPulseSecretKeyForJWTToken...` |

---

## 4. Common Setup Issues & Troubleshooting

### Issue 1: Port 8080 or 5173 is already in use
* **Solution**: Terminate existing processes on that port:
  ```powershell
  # Find PID using port 8080 on Windows
  netstat -ano | findstr :8080
  # Kill process by PID
  taskkill /PID <PID> /F
  ```

### Issue 2: `java: command not found`
* **Solution**: Ensure JDK 17 is installed and added to your system `PATH` environment variable.

### Issue 3: CORS error in browser console
* **Solution**: Ensure the backend's `application.yml` has `cors.allowed-origins: "*"` or includes `http://localhost:5173`.
