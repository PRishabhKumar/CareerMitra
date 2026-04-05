# CareerMitra: Your Intelligent Career Orchestrator

[![Production Live](https://img.shields.io/badge/Live-careermitra.dev-00f2ff?style=for-the-badge&logo=amazonaws)](https://careermitra.dev)
[![Docker Hub](https://img.shields.io/badge/Docker-Hub-blue?style=for-the-badge&logo=docker)](https://hub.docker.com/u/prishabhkumar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Elevate your career with AI-driven resume analysis, ATS scoring, and sub-second LaTeX refinement.**

CareerMitra is a production-grade, full-stack AI platform designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). Unlike standard parsers, CareerMitra utilizes a **containerized LaTeX engine** and **Generative AI** to provide an end-to-end suite: from deep audit reports to instant, high-fidelity PDF generation.

---

## 🏗️ Production Architecture & DevOps

This project is engineered for **scalability, security, and high availability** using a modern cloud-native stack:

- **Global Distribution**: Frontend assets are hosted on **AWS S3** and served via **Amazon CloudFront**, ensuring low-latency delivery through AWS edge locations and SSL termination.
- **Containerized Backend**: The Node.js API is fully **Dockerized**, encapsulating the entire **TeX Live** environment. This ensures that high-speed PDF compilation works out-of-the-box without external dependencies.
- **Secure Orchestration**: Deployed on an **AWS EC2 (Ubuntu 24.04 LTS)** instance behind an **Nginx Reverse Proxy**.
- **Encryption**: Secured with **SSL/TLS certificates** via Certbot (Let's Encrypt), ensuring all sensitive resume data is encrypted in transit.
- **Unlimited Compiles**: By bundling the compiler within the Docker image on AWS, the system supports **unlimited, zero-cost LaTeX compilations**, removing the need for expensive 3rd-party PDF APIs.

---

## 🛠️ Tech Stack

### Frontend & UI/UX

| Layer | Technology |
|-------|------------|
| Framework | React.js (Vite) |
| Aesthetics | Modern Industrial Minimalist / Glassmorphism (Dark Mode Optimized) |
| Styling | Styled Components & Tailwind CSS |
| Icons | Lucide React |

### Backend & AI

| Layer | Technology |
|-------|------------|
| Runtime | Node.js & Express.js (Dockerized) |
| Orchestration | Nginx Reverse Proxy |
| Database | MongoDB Atlas (Managed Cloud) |
| AI Engine | Google Generative AI (Gemini 1.5 Pro) |
| OCR & Parsing | Tesseract.js, `pdf-parse`, `pdf-lib` |
| Typesetting | TeX Live / MikTeX (Pre-bundled in Docker) |

---

## 🐳 Quick Start with Docker (Recommended)

The most efficient way to run CareerMitra is via Docker. The images are pre-configured with all system-level dependencies, including the LaTeX suite.

### 1. Pull the Production Images

```bash
# Pull the Frontend (Optimized Nginx Build)
docker pull prishabhkumar/careermitra-frontend

# Pull the Backend (Bundled with TeX Live)
docker pull prishabhkumar/careermitra-backend
```

### 2. Run with Docker Compose

Create a `docker-compose.yml` file in your root directory:

```yaml
version: '3.8'
services:
  backend:
    image: prishabhkumar/careermitra-backend
    ports:
      - "3000:3000"
    env_file: .env
    restart: always

  frontend:
    image: prishabhkumar/careermitra-frontend
    ports:
      - "80:80"
    restart: always
```

Run the stack:

```bash
docker-compose up -d
```

---

## ⚙️ Local Development Setup (Manual)

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas URL
- Gemini & Cloudinary API Keys
- **Local LaTeX**: You must install [MikTeX](https://miktex.org/) or [TeX Live](https://tug.org/texlive/) for PDF generation to work without Docker.

### 1. Clone the Repository

```bash
git clone https://github.com/PRishabhKumar/CareerMitra.git
cd CareerMitra
```

### 2. Configure the Backend Environment

Create a `.env` file inside the `/Backend` directory:

```env
# Database
DB_CONNECTION_STRING=your_mongodb_atlas_url

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Authentication
JWT_SECRET=your_secure_jwt_string

# AI Engine
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install & Start the Backend

```bash
cd Backend
npm install
npm start
```

The backend will start at `http://localhost:3000`.

### 4. Install & Start the Frontend

Open a **second terminal** from the project root:

```bash
cd Frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` (or whichever port Vite assigns).

### 5. Point the Frontend at Your Local Backend

> ⚠️ **Important:** By default, the frontend is pointed at the production API.

Open `Frontend/src/environment.js` (line 2) and set `prod` to `false`:

```js
// environment.js
const prod = false; // Set to false for local development
```

This switches the API base URL from the live server to `http://localhost:3000`, so your local frontend talks to your local backend.

### Prompt Engineering

The AI behavior is decoupled into standalone `.txt` files in `Backend/prompts/` for easy fine-tuning:

| File | Purpose |
|------|---------|
| `JD_ANALYSIS_PROMPT.txt` | Resume vs. Job Description matching |
| `CODING_PROMPT.txt` | Generating high-fidelity LaTeX code |
| `CHATTING_PROMPT.txt` | Real-time AI-assisted resume editing |

---

## 🔄 Logic & Workflow

```
User Upload (PDF/Image)
        │
        ▼
   OCR & Ingestion
  (Tesseract for images)
        │
        ▼
  ATS Audit + GenAI Analysis
  (Keyword gaps, structure weaknesses)
        │
        ▼
  AI Refinement
  (STAR method bullet points)
        │
        ▼
  LaTeX Generation & Local Compilation
  (No external API costs or limits)
        │
        ▼
  Professional PDF Output
```

1. **Ingestion** — User uploads a resume (PDF/Image). Image-based resumes are processed via Tesseract OCR.
2. **Audit** — The system runs a deterministic ATS algorithm combined with a GenAI audit to identify keyword gaps and structural weaknesses.
3. **Refinement** — AI suggests optimized bullet points based on the **STAR method** (Situation, Task, Action, Result).
4. **Typesetting** — The system generates LaTeX code, compiled locally on the server/container to produce a professional PDF instantly — no external API costs or limits.

---

## 📈 Key Achievements

- **Hybrid Cloud Deployment** — Leveraged the best of both worlds: Serverless-style frontend (S3/CloudFront) and robust containerized backend (EC2/Docker).
- **Production-Grade Security** — Implemented JWT-based auth and hardened AWS Security Groups.
- **Modern UX** — Achieved a clean, matte-black industrial aesthetic with real-time PDF previews.

---

## 🤝 Contributing

Contributions are welcome! Whether it's adding new LaTeX templates or improving the AI prompts, feel free to fork and submit a PR.

---

## 📄 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT). Built with ❤️ by **P Rishabh Kumar**.