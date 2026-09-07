# Stress Monitoring and Recommendation System

A full-stack web application that evaluates a user's stress level using predefined rule-based thresholds based on lifestyle and health-related inputs.

The system allows users to register, submit stress assessments, view their stress score and level, understand contributing factors, receive personalized recommendations, and review historical stress trends.

## Live Application

**Frontend:**  
https://stress-monitoring-system-henna.vercel.app

**Backend API:**  
https://stress-monitoring-api.onrender.com

**Swagger API Documentation:**  
https://stress-monitoring-api.onrender.com/docs

---

## Features

- New user registration
- Existing user identification using email
- Stress assessment based on:
  - Sleep duration
  - Work hours
  - Mood level
  - Screen time
  - Physical activity
  - Heart rate
  - SpO₂
- Rule-based stress score calculation
- Stress classification into Low, Medium, or High
- Short stress summary
- Identification of contributing factors
- Personalized recommendations
- Assessment history
- Dashboard with latest assessment information
- Daily, weekly, and monthly stress trends
- Charts for visualizing stress history
- User profile and assessment statistics
- Persistent PostgreSQL database storage
- REST API documentation using Swagger

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- Python
- FastAPI
- SQLAlchemy
- Uvicorn
- Pydantic
- Psycopg2

### Database

- PostgreSQL
- Neon PostgreSQL

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon

---

## System Architecture

```text
                    User
                      |
                      v
             React + Vite Frontend
                   Vercel
                      |
                  REST API
                      |
                      v
               FastAPI Backend
                   Render
                      |
                  SQLAlchemy
                      |
                      v
             PostgreSQL Database
                    Neon
```

The React frontend collects user input and communicates with the FastAPI backend through REST API requests.

FastAPI validates incoming data using Pydantic schemas and applies the predefined stress calculation rules.

SQLAlchemy is used as the ORM for communicating with the PostgreSQL database hosted on Neon.

---

## Project Structure

```text
StressMonitoringAndRecommendationSystem/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── stress_logic.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── UserAccess.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── Result.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Trends.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Stress Calculation Logic

The application uses predefined rule-based thresholds to estimate stress.

| Condition | Score Added |
|---|---:|
| Sleep duration < 6 hours | +20 |
| Work hours > 10 hours | +15 |
| Mood level <= 2 | +20 |
| Screen time > 8 hours | +10 |
| Physical activity < 30 minutes | +15 |
| Heart rate > 100 BPM | +10 |
| SpO₂ < 95% | +10 |

The maximum possible stress score is **100**.

### Stress Classification

| Stress Score | Stress Level |
|---|---|
| 0–30 | Low |
| 31–60 | Medium |
| 61–100 | High |

The system also records which conditions contributed to the score and generates recommendations based on those factors.

> This stress score is a rule-based estimate created for the assignment and should not be considered a medical diagnosis.

---

## Database Schema

The application contains two main tables.

### Users

| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | User's name |
| email | String | Unique user email |
| created_at | DateTime | User creation time |

### Assessments

| Field | Type | Description |
|---|---|---|
| id | Integer | Primary key |
| user_id | Integer | Foreign key referencing users |
| sleep_duration | Float | Sleep duration in hours |
| work_hours | Float | Work duration in hours |
| mood_level | Integer | Mood level from 1–5 |
| screen_time | Float | Screen time in hours |
| physical_activity | Float | Physical activity in minutes |
| heart_rate | Integer | Heart rate in BPM |
| spo2 | Float | Oxygen saturation percentage |
| stress_score | Integer | Calculated stress score |
| stress_level | String | Low, Medium, or High |
| created_at | DateTime | Assessment creation time |

Relationship:

```text
User
  |
  | 1
  |
  |------< Assessments
             many
```

A user can have multiple stress assessments.

---

## API Endpoints

### Health Check

```http
GET /
```

Checks whether the API is running.

### Create or Retrieve User

```http
POST /users
```

Example request:

```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```

If the email already exists, the existing user is returned.

### Find User by Email

```http
GET /users-by-email?email=test@example.com
```

Used by the existing-user flow.

### Get User Profile

```http
GET /users/{user_id}
```

Returns information about a specific user.

### Create Stress Assessment

```http
POST /assessments
```

Example request:

```json
{
  "user_id": 1,
  "sleep_duration": 5,
  "work_hours": 11,
  "mood_level": 2,
  "screen_time": 9,
  "physical_activity": 20,
  "heart_rate": 105,
  "spo2": 97
}
```

Example calculated result:

```json
{
  "stress_score": 90,
  "stress_level": "High",
  "summary": "Your current inputs indicate a high stress level.",
  "factors": [
    "Low sleep duration",
    "Long work hours",
    "Low mood",
    "High screen time",
    "Low physical activity",
    "High heart rate"
  ]
}
```

The actual API response also contains recommendations, assessment ID, and creation timestamp.

### Get Assessment History

```http
GET /users/{user_id}/assessments
```

Returns the user's assessments ordered from newest to oldest.

Complete interactive API documentation is available at:

https://stress-monitoring-api.onrender.com/docs

---

## Input Validation

FastAPI and Pydantic validate assessment inputs before the stress calculation is performed.

| Input | Accepted Range |
|---|---|
| Sleep Duration | 0–24 hours |
| Work Hours | 0–24 hours |
| Mood Level | 1–5 |
| Screen Time | 0–24 hours |
| Physical Activity | 0–1440 minutes |
| Heart Rate | 30–220 BPM |
| SpO₂ | 50–100% |

Invalid requests are rejected by FastAPI validation.

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kunalrawat7/StressMonitoringAndRecommendationSystem.git
cd StressMonitoringAndRecommendationSystem
```

### 2. Backend Setup

Move into the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it.

Windows Git Bash:

```bash
source venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside `backend`:

```env
DATABASE_URL=your_postgresql_connection_string
```

Start the backend:

```bash
uvicorn main:app --reload --port 8001
```

Backend:

```text
http://127.0.0.1:8001
```

Swagger:

```text
http://127.0.0.1:8001/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

By default, the frontend uses:

```text
http://127.0.0.1:8001
```

as the local API URL.

For another backend URL, configure:

```env
VITE_API_URL=your_backend_url
```

---

## Deployment

### Frontend

The React application is deployed on Vercel:

https://stress-monitoring-system-henna.vercel.app

The production environment contains:

```text
VITE_API_URL=https://stress-monitoring-api.onrender.com
```

### Backend

The FastAPI application is deployed on Render:

https://stress-monitoring-api.onrender.com

Render starts the application using:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Database

The PostgreSQL database is hosted on Neon.

Database credentials are stored using environment variables and are not committed to the repository.

---

## Sample Test Data

A stress assessment can be tested with:

```text
Sleep Duration:      5 hours
Work Hours:          11 hours
Mood Level:          2
Screen Time:         9 hours
Physical Activity:   20 minutes
Heart Rate:          105 BPM
SpO₂:                97%
```

Expected result:

```text
Stress Score: 90
Stress Level: High
```

A new test user can also be created directly from the deployed application.

---

## Future Improvements

Possible production improvements include:

- Secure authentication using password hashing and JWT/session authentication
- Database migrations using Alembic
- Automated backend and frontend tests
- More advanced analytics
- Backend-generated aggregate statistics
- Additional stress factors
- More sophisticated recommendation generation
- Voice assistant integration
- Clinical validation of stress scoring rules

---

## Author

Developed as a Full-Stack Candidate Assignment for Savemom.