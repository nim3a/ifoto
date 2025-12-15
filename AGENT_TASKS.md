# AGENT EXECUTION CONTEXT – ifoto

Current Reality (DO NOT IGNORE):
- Infrastructure: ✅ Ready
- Face recognition service: ✅ Ready
- Backend foundations: ✅ Ready
- Frontend: ⚠️ UI exists, APIs mocked
- End-to-End photo pipeline: ❌ NOT implemented

STRICT RULES:
- Do NOT mock APIs
- Do NOT simulate responses
- Do NOT add new features
- Do NOT change architecture
- Follow existing patterns ONLY

CURRENT TASK (ONLY TASK):
1. Create PhotoController in backend
2. Implement photo upload endpoint
3. Store original photo in MinIO
4. Persist Photo entity in PostgreSQL
5. Call face-service `/api/face/extract`
6. Link extracted embeddings to Photo + Event

Out of scope:
- Frontend
- Async processing
- UI changes
- Watermark
- Performance optimization

You are executing, NOT designing.
