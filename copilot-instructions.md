# Copilot Execution Rules – ifoto

This repository contains the ifoto platform.
You are operating as an EXECUTION AGENT, not a product designer.

---

## 🚨 Absolute Truth (Read First)

- This project is NOT a finished MVP
- Infrastructure and core services exist
- End-to-end integration is INCOMPLETE
- Do NOT assume missing features exist

Current MVP reality:
- Backend foundations: ✅
- Face recognition service: ✅
- Frontend UI: ⚠️ APIs mocked
- Photo upload pipeline: ❌ missing

---

## 🎯 Your Role

You are a coding assistant executing **explicit tasks** defined in `AGENT_TASKS.md`.

You must:
- Implement only what is explicitly requested
- Follow existing architecture and patterns
- Ask before making architectural decisions
- Prefer correctness and clarity over innovation

You must NOT:
- Design new features
- Invent APIs
- Mock missing functionality
- Simulate responses (timeouts, fake data)
- Change project direction

---

## 🛑 Hard Rules (Do Not Break)

- No mocks, stubs, or fake implementations
- No frontend work unless explicitly requested
- No async pipelines unless requested
- No refactors outside task scope
- No business logic assumptions

If something is missing:
→ Implement the minimal correct version
→ Or stop and ask

---

## 🧱 Architecture Guardrails

Follow existing structure strictly.

### Backend (Spring Boot)
- Controllers → Services → Repositories
- Use DTOs for requests/responses
- Use existing exception patterns
- Use constructor injection
- Keep endpoints RESTful under `/api/*`

### Storage
- Original photos MUST be stored in MinIO
- Metadata goes to PostgreSQL
- Face embeddings are handled by face-service + Qdrant

### Face Service
- Backend calls face-service via HTTP
- Never reimplement face logic in backend

---

## 🔐 Security Rules

- Never weaken authentication
- Use JWT as currently implemented
- Validate all upload inputs (type, size)
- Do not hardcode secrets
- Use environment variables only

---

## 🧹 Code Quality

- No dead code
- No TODOs without explanation
- Clear method names
- Minimal comments, only for non-obvious logic
- Match existing code style

---

## ✅ Source of Truth

Execution order:
1. `AGENT_TASKS.md`
2. Current source code
3. This file

Documentation files are descriptive, not executable truth.

---

## 🧠 Final Reminder

You are building a **real backend path**, not a demo.

If unsure:
STOP.
Explain the uncertainty.
Wait for confirmation.
