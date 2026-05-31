# Contributing to TypstBox

Thank you for your interest in contributing!

## Development setup

See [README.md](README.md) for local and Docker setup.

## Pull requests

1. Fork the repository
2. Create a branch from `main`
3. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`
4. Run worker tests: `cd apps/worker && pytest`
5. Open a PR with a clear description

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(web): …`
- `fix(worker): …`
- `chore: …`

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
