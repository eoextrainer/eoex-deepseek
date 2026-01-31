#!/bin/bash

# EOEX Platform - Development Environment Setup

set -e

echo "================================================"
echo "EOEX Platform - Development Setup"
echo "================================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created. Please update with your configuration."
fi

# Create Python virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r backend/requirements.txt

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo ""
    echo "⚠ Docker is not installed. Install it from: https://docs.docker.com/get-docker/"
fi

echo ""
echo "================================================"
echo "✓ Development environment setup completed!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Update your .env file with proper configuration"
echo "2. Start PostgreSQL (locally or via Docker)"
echo "3. Run: source .venv/bin/activate"
echo "4. Run: cd backend && python -m uvicorn app.main:app --reload"
echo ""
