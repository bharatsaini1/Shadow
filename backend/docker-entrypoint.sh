#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Seeding initial data (career tracks are seeded via migration)..."

echo "Starting gunicorn..."
exec gunicorn mentriq.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120
