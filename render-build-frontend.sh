#!/usr/bin/env bash
# Build script for frontend deployment on Render

set -e  # Exit on error

echo "=== KCD Frontend Build Script for Render ==="
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build the frontend
echo "Building frontend..."
npm run build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Frontend build successful"
    echo "Build output directory: $(pwd)/dist"
    echo "Build size: $(du -sh dist | cut -f1)"
else
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "=== Build Complete ==="
