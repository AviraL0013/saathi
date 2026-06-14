# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────────────────────
# SAATHI Backend — multi-stage build
# Stage 1 (builder): install dependencies into an isolated venv
# Stage 2 (runtime): copy the venv onto a clean slim image
# ──────────────────────────────────────────────────────────────

# ── Stage 1: builder ──────────────────────────────────────────
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Create an isolated virtualenv we can copy wholesale into the runtime stage
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Install dependencies first so this layer is cached unless requirements change
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt


# ── Stage 2: runtime ──────────────────────────────────────────
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# Run as a non-root user
RUN useradd --create-home --uid 1000 saathi

# Bring the prebuilt virtualenv across from the builder stage
COPY --from=builder /opt/venv /opt/venv

WORKDIR /app
COPY . .

RUN chown -R saathi:saathi /app
USER saathi

EXPOSE 8000

# Container-level health probe hits the app's /health endpoint.
# /health returns 503 when DynamoDB is unavailable, 200 otherwise.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/health', timeout=4).status==200 else 1)" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
