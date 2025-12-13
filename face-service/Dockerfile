# Dockerfile for Face Recognition Service
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create upload directory with secure permissions
RUN mkdir -p /var/ifoto/uploads && chmod 750 /var/ifoto/uploads

# Create non-root user
RUN useradd -m -u 1000 ifoto && chown -R ifoto:ifoto /app /var/ifoto
USER ifoto

EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
