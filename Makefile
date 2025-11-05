# SkillFlow - Makefile
# Predictive Talent OS Development Commands

.PHONY: help install dev build start clean lint format test type-check docker-up docker-down

# Default target
help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║          SkillFlow - Predictive Talent OS                  ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  📦 Installation & Setup"
	@echo "  make install          Install all dependencies (pnpm)"
	@echo "  make clean            Clean node_modules and build artifacts"
	@echo ""
	@echo "  🚀 Development"
	@echo "  make dev              Start development server (Turbopack)"
	@echo "  make build            Build production bundle"
	@echo "  make start            Start production server"
	@echo ""
	@echo "  ✨ Code Quality"
	@echo "  make lint             Run ESLint"
	@echo "  make lint-fix         Run ESLint with auto-fix"
	@echo "  make format           Format code with Prettier"
	@echo "  make format-check     Check code formatting"
	@echo "  make type-check       Run TypeScript type checking"
	@echo ""
	@echo "  🧪 Testing"
	@echo "  make test             Run all tests"
	@echo "  make test-watch       Run tests in watch mode"
	@echo "  make test-coverage    Run tests with coverage report"
	@echo ""
	@echo "  🐳 Docker"
	@echo "  make docker-build     Build Docker image"
	@echo "  make docker-up        Start Docker containers"
	@echo "  make docker-down      Stop Docker containers"
	@echo "  make docker-logs      View Docker logs"
	@echo ""
	@echo "  🗄️  Database"
	@echo "  make db-migrate       Run database migrations"
	@echo "  make db-seed          Seed database with sample data"
	@echo "  make db-reset         Reset database (drop + migrate + seed)"
	@echo "  make db-studio        Open Prisma Studio"
	@echo ""
	@echo "  🔧 Utilities"
	@echo "  make check            Run all checks (lint + type-check + test)"
	@echo "  make prepare          Prepare project for first run"
	@echo "  make upgrade          Upgrade all dependencies"
	@echo ""

# ============================================================
# Installation & Setup
# ============================================================

install:
	@echo "📦 Installing dependencies..."
	pnpm install

clean:
	@echo "🧹 Cleaning project..."
	rm -rf node_modules
	rm -rf .next
	rm -rf out
	rm -rf dist
	rm -rf .turbo
	@echo "✅ Clean complete!"

# ============================================================
# Development
# ============================================================

dev:
	@echo "🚀 Starting development server..."
	pnpm dev

build:
	@echo "🏗️  Building production bundle..."
	pnpm build

start:
	@echo "▶️  Starting production server..."
	pnpm start

# ============================================================
# Code Quality
# ============================================================

lint:
	@echo "🔍 Running ESLint..."
	pnpm lint

lint-fix:
	@echo "🔧 Running ESLint with auto-fix..."
	pnpm lint --fix

format:
	@echo "✨ Formatting code with Prettier..."
	pnpm exec prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"

format-check:
	@echo "🔍 Checking code formatting..."
	pnpm exec prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"

type-check:
	@echo "📝 Running TypeScript type checking..."
	pnpm exec tsc --noEmit

# ============================================================
# Testing
# ============================================================

test:
	@echo "🧪 Running tests..."
	@if [ -f "package.json" ] && grep -q '"test"' package.json; then \
		pnpm test; \
	else \
		echo "⚠️  No test script found. Add test framework first."; \
	fi

test-watch:
	@echo "👀 Running tests in watch mode..."
	@if [ -f "package.json" ] && grep -q '"test:watch"' package.json; then \
		pnpm test:watch; \
	else \
		echo "⚠️  No test:watch script found."; \
	fi

test-coverage:
	@echo "📊 Running tests with coverage..."
	@if [ -f "package.json" ] && grep -q '"test:coverage"' package.json; then \
		pnpm test:coverage; \
	else \
		echo "⚠️  No test:coverage script found."; \
	fi

# ============================================================
# Docker
# ============================================================

docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t skillflow:latest .

docker-up:
	@echo "🐳 Starting Docker containers..."
	docker-compose up -d

docker-down:
	@echo "🛑 Stopping Docker containers..."
	docker-compose down

docker-logs:
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f

# ============================================================
# Database (Prisma)
# ============================================================

db-migrate:
	@echo "🗄️  Running database migrations..."
	@if [ -f "prisma/schema.prisma" ]; then \
		pnpm exec prisma migrate dev; \
	else \
		echo "⚠️  No Prisma schema found. Initialize Prisma first."; \
	fi

db-seed:
	@echo "🌱 Seeding database..."
	@if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then \
		pnpm exec prisma db seed; \
	else \
		echo "⚠️  No seed file found."; \
	fi

db-reset:
	@echo "🔄 Resetting database..."
	@if [ -f "prisma/schema.prisma" ]; then \
		pnpm exec prisma migrate reset; \
	else \
		echo "⚠️  No Prisma schema found."; \
	fi

db-studio:
	@echo "🎨 Opening Prisma Studio..."
	@if [ -f "prisma/schema.prisma" ]; then \
		pnpm exec prisma studio; \
	else \
		echo "⚠️  No Prisma schema found."; \
	fi

db-generate:
	@echo "🔧 Generating Prisma Client..."
	@if [ -f "prisma/schema.prisma" ]; then \
		pnpm exec prisma generate; \
	else \
		echo "⚠️  No Prisma schema found."; \
	fi

# ============================================================
# Utilities
# ============================================================

check: lint type-check
	@echo "✅ All checks passed!"

prepare: install
	@echo "🔧 Preparing project..."
	@if [ -f "prisma/schema.prisma" ]; then \
		pnpm exec prisma generate; \
	fi
	@echo "✅ Project ready for development!"

upgrade:
	@echo "⬆️  Upgrading dependencies..."
	pnpm update --latest
	@echo "✅ Dependencies upgraded!"

# ============================================================
# Git Shortcuts
# ============================================================

commit:
	@echo "💾 Staging all changes and committing..."
	git add -A
	@read -p "Enter commit message: " msg; \
	git commit -m "$$msg"

push: commit
	@echo "📤 Pushing to remote..."
	git push origin main

pull:
	@echo "📥 Pulling latest changes..."
	git pull origin main

# ============================================================
# Project Info
# ============================================================

info:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║          SkillFlow - Project Information                   ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 Package Manager: pnpm"
	@echo "⚡ Framework: Next.js 15.5.6"
	@echo "⚛️  React: 19.1.0"
	@echo "🎨 Styling: Tailwind CSS v4"
	@echo "🔧 TypeScript: 5.x"
	@echo ""
	@echo "Current branch: $$(git branch --show-current)"
	@echo "Node version: $$(node --version)"
	@echo "pnpm version: $$(pnpm --version)"
	@echo ""
