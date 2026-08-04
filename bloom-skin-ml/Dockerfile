# Use slim Python image to reduce build size and memory footprint
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (curl is needed to download the model)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip

# Install TensorFlow CPU (lighter, no GPU libraries)
RUN pip install --no-cache-dir tensorflow-cpu

# Install remaining requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app
COPY . .

# Download the model file from Hugging Face (FREE hosting)
RUN mkdir -p model && \
    curl -L -o model/skin_problem_classifier_v1.h5 \
    "https://huggingface.co/Rasik3010/bloomskin-model/resolve/main/skin_problem_classifier_v1.h5?download=true"

# Set environment variables
ENV PORT=5000
ENV TF_CPP_MIN_LOG_LEVEL=2
ENV MALLOC_ARENA_MAX=2

# Expose port for Render
EXPOSE 5000

# Use gunicorn for production (1 worker, 120s timeout for model loading)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--worker-class", "gevent", "--timeout", "120", "app:app"]
