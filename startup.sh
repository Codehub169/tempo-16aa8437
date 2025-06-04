#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Expense Tracker Application Setup..."

# Attempt to install build essentials for native Node modules (e.g., sqlite3)
# This is ideally done in the Dockerfile.
# The following attempts to use apt-get (Debian/Ubuntu) or apk (Alpine).
# Assumes the script is run with root privileges or sudo is available and configured without password for these commands.
echo "Attempting to install build essentials (make, g++, python3)..."
if command -v apt-get > /dev/null; then
  echo "Detected apt-get. Updating package list and installing build-essential, python3, make, g++..."
  apt-get update -y && apt-get install -y build-essential python3 make g++
elif command -v apk > /dev/null; then
  echo "Detected apk. Installing build-base, python3, make, g++..."
  apk add --no-cache build-base python3 make g++
else
  echo "WARNING: Neither apt-get nor apk found. Cannot automatically install build essentials."
  echo "Please ensure make, g++, and python3 are installed in your environment for native module compilation."
fi
echo "Build essentials installation attempt finished."

# Update npm to the latest version (or a specific version like the one in logs)
# This also assumes appropriate permissions (e.g., running as root or sudo access for global npm install)
echo "Attempting to update npm globally..."
if command -v npm > /dev/null; then
  npm install -g npm@latest # Or you can use a specific version e.g., npm@11.4.1 as suggested in logs
  echo "npm update attempt finished."
else
    echo "WARNING: npm command not found. Skipping npm update."
fi

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
        echo "Frontend build script executed (or was not present)."
        if [ -f "dist/index.html" ]; then
            echo "Frontend application built successfully and dist/index.html found."
        else
            echo "WARNING: frontend/dist/index.html not found after build attempt (or no build script produced it)."
            echo "Creating placeholder dist directory for frontend."
            mkdir -p dist
            echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Build Incomplete</h1><p>The build script ran (or was not present), but 'dist/index.html' was not found. A placeholder has been created.</p></body></html>" > dist/index.html
        fi
    else
        echo "Frontend build failed. Creating placeholder dist directory."
        mkdir -p dist
        echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Build Failed</h1><p>The frontend build process failed. Please check build configuration and logs. A placeholder has been created.</p></body></html>" > dist/index.html
    fi
  else
    echo "frontend/package.json not found. Skipping frontend npm install and build."
    mkdir -p dist
    echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Not Built</h1><p>frontend/package.json was not found. Frontend dependencies not installed and not built. A placeholder has been created.</p></body></html>" > dist/index.html
    echo "Created placeholder frontend/dist/index.html."
  fi
  cd ..
else
  echo "Frontend directory not found. Skipping frontend setup."
  mkdir -p frontend/dist
  echo "<!DOCTYPE html><html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Directory Missing</h1><p>The frontend directory was not found. Frontend cannot be built. A placeholder has been created.</p></body></html>" > frontend/dist/index.html
  echo "Created placeholder frontend/dist/index.html as frontend directory is missing."
fi


# Start the backend server
echo "Starting backend server on port 9000..."
echo "The server will serve the frontend application from frontend/dist/"
# Check if backend/server.js exists before trying to run it
if [ -f "backend/server.js" ]; then
  node backend/server.js
else
  echo "Error: backend/server.js not found. Cannot start server."
  exit 1
fi

echo "Application startup script finished."
echo "Access the application at http://localhost:9000"
