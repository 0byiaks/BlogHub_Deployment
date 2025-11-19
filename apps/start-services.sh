#!/bin/bash

# Start all backend services for BlogHub

echo "🚀 Starting BlogHub Backend Services..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to start a service
start_service() {
    local service_name=$1
    local port=$2
    local dir=$3
    
    echo -e "${BLUE}Starting ${service_name} on port ${port}...${NC}"
    cd "$dir"
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for ${service_name}..."
        npm install
    fi
    # Create logs directory if it doesn't exist
    mkdir -p ../logs
    npm start > "../logs/${service_name}.log" 2>&1 &
    echo $! > "../logs/${service_name}.pid"
    cd ..
    sleep 2
    echo -e "${GREEN}✓ ${service_name} started${NC}"
}

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Start services
start_service "post-service" "3001" "post-service"
start_service "comment-service" "3002" "comment-service"
start_service "user-service" "3003" "user-service"
start_service "notification-service" "3004" "notification-service"

echo ""
echo -e "${GREEN}✓ All services started!${NC}"
echo ""
echo "Services running on:"
echo "  - Post Service:        http://localhost:3001"
echo "  - Comment Service:     http://localhost:3002"
echo "  - User Service:        http://localhost:3003"
echo "  - Notification Service: http://localhost:3004"
echo ""
echo "Logs are in:"
echo "  - logs/post-service.log"
echo "  - logs/comment-service.log"
echo "  - logs/user-service.log"
echo "  - logs/notification-service.log"
echo ""
echo "To stop all services, run: ./stop-services.sh"

