#!/bin/bash

# Stop all backend services for BlogHub

echo "🛑 Stopping BlogHub Backend Services..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Kill services by PID files
if [ -d "logs" ]; then
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            service_name=$(basename "$pid_file" .pid)
            pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid"
                echo "✓ Stopped $service_name"
            fi
            rm "$pid_file"
        fi
    done
fi

# Also kill any processes on our ports
lsof -ti:3001,3002,3003,3004 | xargs kill -9 2>/dev/null || true

echo "✓ All services stopped"

