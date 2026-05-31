# TypstBox (`typst-online`)

**Compile Typst documents to PDF, SVG, PNG and HTML online** with pinned compiler versions, Typst Universe package allowlist, custom fonts, and a live editor playground.

TypstBox is a free, open-source alternative to installing Typst locally — write in the browser, preview with PDF.js, export artifacts, and self-host with Docker.

## Features

- **Live editor** — Monaco Typst syntax, multi-file tree, asset uploads
- **Left sidebar** — compiler version, package browser, font manager
- **Compile** — PDF (default), SVG, PNG, HTML with page ranges
- **Version pinning** — last 3 stable typst-cli versions
- **Packages** — allowlisted Typst Universe imports (`@preview/cetz`, etc.)
- **Fonts** — default set plus TTF/OTF/WOFF uploads
- **Templates** — resume, paper, report, invoice, slides, letter, thesis
- **Diagnostics** — per-file line/column errors; lint-only mode
- **Share & fork** — read-only share links with fork-to-edit
- **Export** — project ZIP and PDF download

## Quick start

### Docker (recommended)

```bash
docker compose up --build
```

- Web: http://localhost:3000
- Worker API: http://localhost:8080

### Local development

```bash
# Install typst (example)
curl -fsSL https://github.com/typst/typst/releases/download/v0.13.1/typst-x86_64-unknown-linux-musl.tar.xz \
  | tar -xJ --strip-components=1 -C ~/.local/bin typst-x86_64-unknown-linux-musl/typst

pnpm install
pnpm --filter @typstbox/shared-types build

# Terminal 1 — worker
cd apps/worker && pip install -r requirements.txt
uvicorn typstbox_worker.main:app --reload --port 8080

# Terminal 2 — web
WORKER_URL=http://127.0.0.1:8080 pnpm --filter @typstbox/web dev
```

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/compile` | Compile project |
| POST | `/v1/preview` | Debounced preview (PDF) |
| POST | `/v1/diagnostics` | Lint-only |
| GET | `/v1/versions` | Pinned compiler versions |
| GET | `/v1/packages` | Allowlisted packages |
| GET | `/v1/fonts` | Default fonts |
| POST | `/v1/share` | Create share link |
| POST | `/v1/export/zip` | Download project ZIP |

## License

AGPL-3.0 — see [LICENSE](LICENSE).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Main playground |
| `/t/{templateId}` | Fork template to edit |
| `/typst-playground`, `/typst-resume`, … | SEO landing pages |
| `/faq`, `/privacy`, `/terms` | Legal & help |

## Testing

```bash
cd apps/worker && PYTHONPATH=. python3 -m pytest -q
pnpm typecheck && pnpm --filter @typstbox/web build
cd apps/web && pnpm exec playwright test
```

## Links

- GitHub: https://github.com/chayprabs/typst-online
- FAQ: `/faq` on deployed site
- Author: https://www.chaitanyaprabuddha.com
