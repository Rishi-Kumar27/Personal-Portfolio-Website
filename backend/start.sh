#!/bin/bash

# Portfolio Backend Startup Script

echo "🚀 Starting Portfolio Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before running again."
    exit 1
fi

# Create necessary directories
mkdir -p public/files data

# Start the server
if [ "$1" = "dev" ]; then
    echo "🔧 Starting in development mode..."
    npm run dev
else
    echo "🏭 Starting in production mode..."
    npm start
fi