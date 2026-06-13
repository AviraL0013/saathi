# SAATHI — Smart Anticipatory Automation for The Home Intelligence

> **HackOn with Amazon 8.0 — Alexa Plus Track**

An AI system that understands Indian household context and **anticipates** actions — not just responds to them.

---

## The Problem

Indian homes have unique rhythms — morning pooja, pressure cooker schedules, water motor timings, power cuts, tuition hours, evening chai. Today's smart devices still need explicit commands. SAATHI changes that.

## The Architecture

SAATHI uses a **Two-Path Intelligence Architecture**:

```
Every event → Reasoning Trigger Evaluator (RTE)
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   RULE ENGINE (~85%)    BEDROCK (~15%)
   <50ms, zero AI        Complex coordination
   Safety-critical       Multi-member reasoning
   Always available      Claude Sonnet 3.5
```

**Key principle:** Bedrock reasons. Rules automate. These two paths are never conflated.

## Project Structure

```
saathi/
├── backend/          ← Python FastAPI server
│   ├── adapters/     ← Device adapter layer (one per device type)
│   ├── db/           ← DynamoDB client + seeding
│   ├── data/         ← Seed data (Sharma family household)
│   ├── tests/        ← pytest test suite
│   └── ...           ← Core modules (rte, rule_engine, bedrock_layer, etc.)
└── frontend/         ← React + Vite dashboard
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI |
| AI | AWS Bedrock (Claude Sonnet 3.5) |
| Database | AWS DynamoDB (7 tables) |
| Graph | NetworkX (in-memory, DynamoDB-backed) |
| Frontend | React + Vite + D3.js |
| Real-time | WebSocket |

## AWS Services Used

- **Amazon Bedrock** — Claude Sonnet 3.5 for complex household coordination
- **Amazon DynamoDB** — Source of truth for graph, rules, patterns, audit logs, metrics
- **Amazon Kinesis** *(architecture reference)* — Event ingestion at scale

## DynamoDB Tables

| Table | Purpose |
|---|---|
| `HouseholdGraph` | Adjacency list knowledge graph |
| `HouseholdRules` | All rule schemas (safety, health, custom, fleet) |
| `HouseholdPatterns` | Pattern confidence + lifecycle state |
| `RTEAuditLog` | Every routing decision logged (90-day TTL) |
| `HouseholdMetrics` | Latency, cost, routing stats |
| `ActionLog` | All dispatched actions with source tags |
| `ConflictAuditLog` | Rule conflict resolution history |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- AWS credentials with Bedrock + DynamoDB access (ap-south-1)

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # fill in your AWS credentials
python db/seed_dynamo.py      # create + seed all DynamoDB tables
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Run Demo
```bash
# With backend running:
curl -X POST http://localhost:8000/simulate/start
# Open http://localhost:5173 to see the live dashboard
```

## Key Metrics (Production Architecture v2.0)

| Metric | v1 Architecture | v2 Architecture (SAATHI) |
|---|---|---|
| Bedrock calls/household/day | 50–200 | **6–12** |
| Device automation latency (p99) | 2,000–3,000ms | **<50ms** |
| Functionality during Bedrock outage | ~0% | **~85%** |
| Context tokens per Bedrock call | ~3,800 | **~1,200** |
| Estimated cost at 1M households | $4,550/day | **$1,596/day** |

## Team

Built for HackOn with Amazon 8.0.
