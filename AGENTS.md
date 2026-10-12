# AGENTS.md

## Project

AI Knowledge Base — a RAG-based chatbot over user-uploaded files (PDF/DOCX/TXT/MD), built as a personal portfolio project spanning backend engineering, AI engineering, and DevOps.

Monorepo layout (target state, per `agents/structure.md`):

```
ai-knowledge-base/
├── apps/
│   ├── api/              # Express + TypeScript
│   ├── worker/           # Background jobs (later)
│   └── web/              # React + TypeScript (later)
├── packages/
│   ├── database/         # Prisma + PostgreSQL + pgvector (later)
│   ├── contracts/        # Shared schemas (later)
│   ├── ai/               # Model adapters (later)
│   └── config/           # Shared env config ✅ exists
├── docs/
├── AGENTS.md
├── package.json
└── .gitignore
```

## Agreed stack

- Node.js 24, npm workspaces
- Express + TypeScript (API)
- PostgreSQL, Prisma, pgvector (vector storage)
- Redis + BullMQ (background ingestion jobs)
- React + TypeScript (frontend, later)
- Hosted and local AI models, compared against each other
- Docker, GitHub Actions, production observability

LLM provider, chat interface, and milestone sequencing are undecided — see `docs/decision.md`.

## Conventions

- ESM everywhere (`"type": "module"`), TypeScript `module`/`moduleResolution`: `NodeNext`. Relative imports must carry the `.js` extension.
- Shared compiler options live in root `tsconfig.base.json` (strict + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`). Root `tsconfig.json` is a solution file (references only). Each workspace extends the base and declares its own `include`/`outDir`.
- Cross-package typechecking uses TS project references (`composite: true`). Build/typecheck the whole repo with `npm run build` (`tsc -b`); it is incremental.
- npm workspaces only — never install dependencies at the root without declaring them in the correct workspace package.
- Config via environment variables loaded from `.env`; never commit secrets. Keep `.env.example` in sync.
- Keep modules small and single-purpose; export explicit named functions/types.
- Commit messages: short imperative summary. Do not commit unless explicitly asked.

## Naming & aliases

| Thing | Rule | Examples |
|---|---|---|
| npm package name | scope `@aikb`, one word | `@aikb/api`, `@aikb/worker`, `@aikb/web`, `@aikb/config`, `@aikb/database`, `@aikb/ai`, `@aikb/contracts` |
| Directory | lowercase, single segment | `apps/api`, `packages/config` |
| Source files | kebab-case; entrypoint is `index.ts` | `app.ts`, `health.ts`, `file-parser.ts` |
| Types / classes / interfaces | PascalCase | `AppConfig`, `NodeEnv` |
| Functions / variables | camelCase | `loadConfig`, `nodeEnv` |
| Env vars | SCREAMING_SNAKE_CASE | `PORT`, `NODE_ENV`, `DATABASE_URL` |
| Import aliases | none (no `paths`) — import cross-package as `@aikb/<name>`; npm workspaces symlink + `exports` resolve types and runtime | `import { config } from "@aikb/config";` |

Do not add `compilerOptions.paths` aliases; project references + workspace symlinks are the single resolution mechanism.

## Incremental implementation

1. One task at a time, in the order set by `docs/flow.md`.
2. Verify each step before marking it complete (run it, or inspect the file/commands that prove it).
3. Preserve existing files and conventions; never overwrite unrelated work.
4. Distinguish planned vs. completed work in all documentation.
5. Stop after each task and report; do not chain into the next task uninvited.

## Testing

- Tests are not yet set up. When a test framework is added, record it here and in `docs/flow.md`.
- Never claim tests, builds, lint, or features are complete without having run them.
- Minimum bar before calling a task done: `npm run build` (`tsc -b`) succeeds and, for API changes, the server starts and `/health` responds.
- Verify env changes against `.env.example`; the example must list every variable a service reads.

## Security

- No secrets in the repo, logs, or committed `.env`.
- Validate and sanitize all uploaded files; cap file size and allowed types.
- Parameterize all SQL/Prisma queries; treat retrieved document content as untrusted input in prompts (prompt-injection awareness).
- Require approval before database migrations, data deletion, or any destructive operation.

## Documentation

- `docs/decision.md` — architectural decisions, rationale, open questions. Update when a meaningful decision is made or resolved.
- `docs/flow.md` — roadmap, verified completed work, current status, next task. Update whenever implementation progress changes.
- `README.md` — project overview for humans.
- Never mark work complete without verification evidence.
