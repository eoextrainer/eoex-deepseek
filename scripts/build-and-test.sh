#!/bin/bash

# EOEX Platform Build and Test Script

set -e

echo "================================================"
echo "EOEX Platform - Build and Test Suite"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python version
echo -e "${YELLOW}Checking Python version...${NC}"
python --version

# Check if virtual environment exists
if [ ! -d "backend/venv" ] && [ ! -d ".venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python -m venv .venv
fi

# Activate virtual environment
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
fi

echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install --quiet --upgrade pip
if [ -f "backend/requirements.txt" ]; then
    pip install --quiet -r backend/requirements.txt
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

echo ""

# Run backend tests
echo -e "${YELLOW}Running backend tests...${NC}"
if command -v pytest &> /dev/null; then
    cd backend
    pytest app/tests/ -v --tb=short
    TEST_RESULT=$?
    cd ..
    if [ $TEST_RESULT -eq 0 ]; then
        echo -e "${GREEN}✓ All backend tests passed${NC}"
    else
        echo -e "${RED}✗ Backend tests failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ pytest not found${NC}"
    exit 1
fi

echo ""

# Code quality checks
echo -e "${YELLOW}Running code quality checks...${NC}"
if command -v flake8 &> /dev/null; then
    flake8 backend/app --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
    echo -e "${GREEN}✓ Code quality checks completed${NC}"
fi

echo ""

# Docker build check
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Checking Docker setup...${NC}"
    if [ -f "Dockerfile.backend" ]; then
        docker build -f Dockerfile.backend -t eoex-backend:test . --quiet
        echo -e "${GREEN}✓ Backend Docker image built${NC}"
    fi
fi

echo ""
echo -e "${GREEN}================================================"
echo "✓ Build and test completed successfully!"
echo "================================================${NC}"
echo ""
echo "Next steps:"
echo "1. To run the application locally:"
echo "   python -m uvicorn app.main:app --reload"
echo ""
echo "2. To run with Docker:"
echo "   docker-compose up"
echo ""
echo "3. Access the API:"
echo "   - Swagger UI: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo ""
