# Use Node.js 20 on Debian
FROM node:20-slim

# Step 1: Install system dependencies (Poppler for PDF and TeX Live for LaTeX)
# We install 'texlive-latex-extra' to cover 99% of resume packages
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    poppler-utils \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

# Step 2: Setup Application
WORKDIR /app
COPY ./Backend/package*.json ./
RUN npm install

# Copy backend source code
COPY ./Backend ./

EXPOSE 5000

# Start using the start.js entrypoint
CMD ["node", "start.js"]