LearnX

LearnX is a university portal for students and faculty. Students can upload assignments, take subject-wise quizzes, read faculty notes, revise with flashcards, and get help from a built-in study agent. Faculty can view their sections, publish notes, track assignment submissions, and review quiz results for their own subjects.

Live demo-

Frontend (Vercel): add your Vercel link here
Backend API (Render): add your Render link here, for example https://learnx-1-lctg.onrender.com/api/courses

{Note: the free Render backend sleeps when idle, so the first request can take about a minute.}

Project structure

frontend: the React and Vite web application.
LEARNX-backend: the Spring Boot REST API with the database, file storage, and study agent.

Technology stack

Frontend: React 18, Vite, Lucide icons, inline theme system
Backend: Java 17, Spring Boot 3.5, Spring Data JPA, Spring Validation, Spring Actuator
Database: H2 file database for development (MySQL configuration is included for production)
Hosting: Vercel for the frontend, Render for the backend
AI agent: Anthropic Messages API, called from the server, with an offline fallback

Features-

Student portal
- Login with roll number and password
- Profile with CGPA, department, batch, section, attendance, and assignment status
- Assignments with file upload (PDF, DOC, DOCX, PPTX, ZIP), due dates at 23:59, late marking, and versioned re-uploads
- Subject-wise quizzes with a per-question explanation and a saved score
- Faculty notes filtered by subject, with open and download options
- Flashcards built from quiz questions, with mastery tracking
- Upcoming tests and attendance overview
- Study agent: page summaries, unit key points, and explanations for wrong answers

Faculty portal
- Login with faculty ID and password
- Access limited to assigned subjects and sections (J, K, L, M)
- Section view with student roster, search, and average CGPA
- Upload Center for publishing notes to the subject taught
- Submissions tracker showing on-time, late, missing, and pending work, with file download
- Quiz manager showing units, question counts, and class averages

Demo logins

Student: J01, password j01@123. Any roll number follows the same pattern, for example K01 with k01@123, L60 with l60@123, and M33 with m33@123. Roll numbers run J01 to J65, K01 to K60, L01 to L60, and M01 to M60.
Student: J65, password student123
Faculty: FAC01, password faculty1 (AIML and Labs for AIML)
Faculty: FAC02, password faculty2 (OS and Labs for OS)
Faculty: FAC03, password faculty3 (Advanced Computer Algorithms)
Faculty: FAC04, password faculty4 (no subjects assigned yet)

Running locally

Backend
1. Open the LEARNX-backend folder in Spring Tools, or any Java IDE.
2. Run the LearnxBackendApplication class as a Spring Boot application.
3. The server starts on port 8080. The database is created automatically in the data folder, and demo students and faculty are seeded on first start.

Frontend
1. Open a terminal in the frontend folder.
2. Run npm install, then npm run dev.
3. Open http://localhost:5173 in the browser.

Configuration

The backend reads these settings from application.properties or environment variables:
- ANTHROPIC_API_KEY: optional, enables AI answers. Without it, the agent uses offline logic.
- SPRING_PROFILES_ACTIVE: set to dev for the H2 database.
- LEARNX_CORS_ALLOWEDORIGINS: comma-separated list of frontend addresses allowed to call the API.
- PORT: set automatically by Render.

The frontend reads VITE_API_URL, which points to the backend API, for example https://your-backend.onrender.com/api. If it is not set, it defaults to http://localhost:8080/api.

Main API endpoints

POST /api/auth/login: sign in as a student or faculty member
GET /api/courses: list courses
GET /api/courses/{code}/units: list units for a course
GET /api/units/{slug}: unit with its questions
POST /api/quiz-attempts: submit and grade a quiz
GET /api/students/{roll}/quiz-attempts: a student's quiz history
GET /api/assignments: list assignments
POST /api/assignments/{id}/submissions: upload a submission
GET /api/submissions: list submissions, filtered by assignment or roll number
GET /api/materials: list faculty notes
POST /api/materials: publish a note (multipart form)
GET /api/students?section=J: roster for a section
POST /api/agent: study agent request

Known limitations

Passwords are stored in plain text, and the server does not yet check the login on every request. This is acceptable for a classroom demonstration only. Hashed passwords and token-based authentication are required before any real use.

Uploaded files and the H2 database may reset when the hosted backend restarts, because the free hosting tier has no persistent disk.

Student names, attendance records, and the timetable are placeholder data.

Future work

Secure authentication with hashed passwords and tokens
Hosted MySQL or PostgreSQL database and cloud file storage
Real student and faculty data import
Mobile-friendly layout
