#!/bin/bash

# Test login with demo credentials
echo "Testing login with demo credentials..."
echo "Email: admin@kixindeyangongo.ao"
echo "Password: demo123"
echo ""

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kixindeyangongo.ao",
    "password": "demo123"
  }' \
  -v

echo ""
echo "Test completed"
