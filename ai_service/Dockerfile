# Use a lightweight official Python runtime
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install requirements. We install tensorflow-cpu to significantly reduce image size and memory usage
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir tensorflow-cpu && \
    pip install --no-cache-dir -r requirements.txt gunicorn

# Copy application files
COPY . .

# Expose port 5001
EXPOSE 5001

# Run using Gunicorn (production grade WSGI server)
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--timeout", "120", "--workers", "1", "app:app"]
