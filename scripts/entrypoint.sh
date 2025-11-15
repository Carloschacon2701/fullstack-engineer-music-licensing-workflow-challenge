#!/bin/sh
# This script runs when the container starts

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running TypeORM migrations..."
# The DATABASE_URL for this command will be passed in from the 'docker run' command
npx typeorm-ts-node-commonjs migration:run -d dist/db/datasource.js

echo "Migrations complete. Starting the app..."

exec "$@"