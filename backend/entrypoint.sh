#!/bin/sh
# This script runs when the container starts

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running Prisma migrations..."
# The DATABASE_URL for this command will be passed in from the 'docker run' command
npx prisma migrate deploy

echo "Running database seed..."
node dist/prisma/seed.js

echo "Migrations and seeding complete. Starting the app..."

# 'exec "$@"' runs the CMD (command) defined in the Dockerfile.
# In your case, it will run: 'node dist/src/main.js'
exec "$@"