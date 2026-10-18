# Contributing to Posh Puzzle

Thank you for your interest in contributing to **Posh Puzzle**! We welcome contributions from developers, designers, and testers worldwide.

---

## 🛠 Development Workflow

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/posh_puzzle.git
cd posh_puzzle
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 3. Branching Conventions
Create a dedicated feature branch from `main`:
```bash
git checkout -b feat/your-feature-name
# or for bugfixes:
git checkout -b fix/issue-description
```

### 4. Running the Development Servers
```bash
# Concurrent execution of Backend (:5001) and Frontend (:3001)
npm run dev
```

---

## 🧪 Testing Standards

Before submitting a Pull Request, ensure all automated test suites pass with 100% success rate:

```bash
# Backend test suite (17 integration tests)
cd backend && npm test

# Frontend test suite (11 unit and component tests)
cd ../frontend && npm test -- --watchAll=false

# Frontend production compilation check (must have 0 errors and 0 warnings)
npm run build
```

---

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature or user-facing capability
- `fix:` A bug fix
- `docs:` Documentation updates only
- `style:` Code style changes (whitespace, formatting, missing semicolons)
- `refactor:` Code changes that neither fix a bug nor add a feature
- `perf:` Performance optimizations
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency updates

Example:
```text
feat(catalog): add side-by-side product comparison engine
fix(auth): prevent race condition during 1-click demo login
test(currency): verify JPY integer rounding without decimal places
```

---

## 🚀 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against `main`.
3. Complete the PR checklist and provide relevant screenshots or test outputs.
4. Ensure the GitHub Actions CI pipeline passes all checks.

Thank you for helping make Posh Puzzle the gold standard in luxury e-commerce!
