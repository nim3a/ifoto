#!/bin/bash
# ifoto Docker Quick Start Script
# This script helps you set up and run the ifoto platform

echo "=================================="
echo "  ifoto Platform - Docker Setup  "
echo "=================================="
echo ""

# Check if Docker is running
echo "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "✗ Docker is not running. Please start Docker."
    exit 1
fi
echo "✓ Docker is running"

# Navigate to script directory
cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file and set secure passwords!"
    echo "   Required changes:"
    echo "   - POSTGRES_PASSWORD"
    echo "   - JWT_SECRET (minimum 64 characters)"
    echo "   - MINIO_ROOT_PASSWORD"
    echo ""
    
    read -p "Have you updated the .env file? (yes/no): " continue
    if [ "$continue" != "yes" ]; then
        echo "Please update .env file and run this script again."
        exit 0
    fi
fi

# Start services
echo ""
echo "Starting ifoto services..."
echo "This may take 5-10 minutes on first run (downloading images and AI models)..."
echo ""

docker compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Services started successfully!"
    echo ""
    echo "Access the application at:"
    echo "  Frontend:      http://localhost"
    echo "  Backend API:   http://localhost:8080/api"
    echo "  MinIO Console: http://localhost:9001"
    echo ""
    echo "To view logs:"
    echo "  docker compose logs -f"
    echo ""
    echo "To stop services:"
    echo "  docker compose down"
    echo ""
else
    echo ""
    echo "✗ Failed to start services. Check the output above for errors."
    echo ""
    echo "Common issues:"
    echo "  - .env file not configured correctly"
    echo "  - Ports already in use (80, 8080, 5000, 5432, 6333, 9000)"
    echo "  - Not enough Docker resources allocated"
    echo ""
fi
