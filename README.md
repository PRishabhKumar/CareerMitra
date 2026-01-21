# CareerMitra - Your Intelligent Career Companion

> **Elevate your career with AI-driven resume analysis, ATS scoring, and refinement.**

CareerMitra is a powerful, full-stack application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). By leveraging advanced text processing, OCR, and Generative AI, CareerMitra provides detailed insights, matching scores against job descriptions, and actionable suggestions to improve your CV.

---

## Key Features

- **Smart ATS Scoring**: Deterministic and explainable scoring algorithm based on keyword matching, structure analysis, and action verbs.
- **Advanced Parsing**: Handles PDFs and Images using OCR (Tesseract.js) and PDF parsing tools.
- **GenAI Integration**: Uses advanced AI (Gemini) to provide deep analysis and "fix-it" capabilities for resumes.
- **Document Preview**: Real-time PDF and code preview with syntax highlighting.
- **Secure Authentication**: Protected routes and user data privacy with JWT authentication.
- **Premium UI**: A modern, glassmorphic, and responsive interface built with React and Styled Components.

---

## Tech Stack

### Frontend

- **Framework**: React.js (Vite)
- **Styling**: Styled Components, Vanilla CSS
- **Routing**: React Router Dom
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **AI/ML**: Google Generative AI (Gemini)
- **File Handling**: Multer, Cloudinary
- **PDF/Text**: `pdf-parse`, `pdf-lib`, `tesseract.js`
- **Compiler**: MikTex (Local In-built) - Used for high-speed, zero-cost LaTeX compilation.
- **Security**: BCrypt, JSON Web Token (JWT)

---

## Logic & Workflow

1.  **User Onboarding**: Users sign up and log in to access the dashboard.
2.  **Upload & Store**: Users upload their resume (PDF/Image). The file is securely stored on Cloudinary.
3.  **Parsing & OCR**:
    - Text is extracted from PDFs.
    - If the PDF is image-based, OCR is performed to extract text.
4.  **Analysis**:
    - **ATS Score**: The system calculates a score (0-100) based on skill matching, section detection, and keyword density.
    - **Refinement**: AI models analyze the content to suggest improvements or rewrite sections.
5.  **Results**: Users receive a detailed report with their score, missing keywords, and an optimized version of their resume.

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Valid API Keys (Gemini, Cloudinary)
- **MikTex**: You MUST install MikTex for local PDF compilation. This ensures fastest responses and no API costs.

### 1. Clone the Repository

```bash
git clone https://github.com/PRishabhKumar/CareerMitra.git
cd CareerMitra
```

### 2. Install Dependencies

You need to install dependencies for both the Client and Server.

**Frontend:**

```bash
cd Frontend/CareerMitra\ Frontend
npm install
```

**Backend:**

```bash
cd ../../Backend
npm install
```

### 3. Environment Configuration (CRITICAL STEP)

You **MUST** configure your environment variables. This project relies on custom prompts for AI functionality.

Create a `.env` file in the **Backend** directory and populate it with the following keys.

> **IMPORTANT:** The AI prompts are **not** hardcoded. You must craft your own prompts to guide the AI for resume analysis, code generation, or refinement. You can use tools like **Claude** or **ChatGPT** to generate high-quality system prompts for these keys.

```env
# Database Configuration
MONGODB_USERNAME=your_db_username
DB_CLUSTER_PASSWORD=your_db_password
DB_CONNECTION_STRING=your_mongodb_connection_string

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_API_ENV_VARIABLE_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Service Keys
GEMINI_API_KEY=your_gemini_key

# CUSTOM AI PROMPTS
# Craft these carefully! They dictate how the AI behaves.

# Prompt for analyzing resume against a Job Description
JD_ANALYSIS_PROMPT="[Your detailed prompt for analyzing resume vs JD]"

# Prompt for general resume analysis
GENERAL_ANALYSIS_PROMPT="[Your detailed prompt for comprehensive resume audit]"

# Prompt for generating/editing LaTeX code
CODING_PROMPT="[Your strict prompt for LaTeX code generation]"

# Prompt for the chat interface/LaTeX editor logic
CHATTING_PROMPT="[Your prompt for the editing assistant]"
```

### 4. Run the Application

**Start the Backend:**

```bash
# In /Backend directory
npm start
# or for dev
npm run dev
```

**Start the Frontend:**

```bash
# In /Frontend/CareerMitra Frontend directory
npm run dev
```

Visit `http://localhost:5173` (or the port shown in your terminal) to view the app!

---

## Important Notes

- **MikTex Requirement**: Since this project uses a local **MikTex** compiler, it eliminates 3rd-party API costs for PDF generation and ensures the fastest possible performance. **You must download and install MikTex** on your machine for the resume generation features to work.
- **AI API Stability**: You might occasionally face errors from the AI service (Gemini) due to high traffic or model overload. Please note that these are external service issues and **not faults in the code**.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

---

## License

This project is licensed under the MIT License.
