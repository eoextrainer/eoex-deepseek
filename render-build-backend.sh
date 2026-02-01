#!/usr/bin/env bash
# Build script for backend deployment on Render

set -e  # Exit on error

echo "=== KCD Backend Build Script for Render ==="
echo "Python Version: $(python --version)"
echo "Pip Version: $(pip --version)"

# Navigate to backend directory
cd backend

# Create virtual environment if needed (Render usually handles this)
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
    source venv/bin/activate || . venv/Scripts/activate
fi

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

echo "=== Backend Build Complete ==="
