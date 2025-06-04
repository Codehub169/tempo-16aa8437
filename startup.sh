#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Expense Tracker Application Setup..."

# Backend setup
echo "Setting up backend..."
if [ -d "backend" ]; then
  cd backend
  if [ -f "package.json" ]; then
    npm install
    echo "Backend dependencies installed."
  else
    echo "backend/package.json not found. Skipping backend npm install."
  fi
  cd ..
else
  echo "Backend directory not found. Skipping backend setup."
fi

# Frontend setup
echo "Setting up frontend..."
# Check if frontend directory and package.json exist
if [ -d "frontend" ]; then
  cd frontend
  if [ -f "package.json" ]; then
    npm install
    echo "Frontend dependencies installed."
    echo "Building frontend application..."
    # Assuming 'build' script is defined in frontend/package.json
    # The build script should create a 'dist' folder in 'frontend'
    if npm run build --if-present; then # --if-present will not fail if script is missing
        echo "Frontend application built successfully or build script not present."
    else
        echo "Frontend build failed. Creating placeholder dist directory."
        mkdir -p dist
        echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Build Failed</h1><p>Please check frontend build configuration.</p></body></html>" > dist/index.html
    fi
  else
    echo "frontend/package.json not found. Skipping frontend npm install and build."
    mkdir -p dist
    echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend not built yet.</h1><p>Run frontend build process (npm install && npm run build in frontend directory).</p></body></html>" > dist/index.html
    echo "Created placeholder frontend/dist/index.html."
  fi
  cd ..
else
  echo "Frontend directory not found. Skipping frontend setup."
  mkdir -p frontend/dist
  echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Directory Missing</h1><p>Frontend structure not available.</p></body></html>" > frontend/dist/index.html
  echo "Created placeholder frontend/dist/index.html as frontend directory is missing."
fi


# Start the backend server
echo "Starting backend server on port 9000..."
echo "The server will serve the frontend application."
# Check if backend/server.js exists before trying to run it
if [ -f "backend/server.js" ]; then
  node backend/server.js
else
  echo "Error: backend/server.js not found. Cannot start server."
  exit 1
fi

echo "Application startup script finished."
echo "Access the application at http://localhost:9000"
