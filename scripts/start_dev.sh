#!/bin/bash

docker_compose_file_location="../docker-compose.yaml"

get_service_order() {
    compose_data=$(<"$docker_compose_file_location")
    services=$(echo "$compose_data" | yq eval '.services | keys | .[]' -)
    echo "$services"
}

get_running_services() {
    running_services=$(docker-compose -f "$docker_compose_file_location" ps -q)
    echo "$running_services"
}

start_services() {
    service_order=$(get_service_order)
    running_services=$(get_running_services)

    for service in $service_order; do
        if [[ $running_services != *"$service"* ]]; then
            echo "Checking service '$service'..."
            docker-compose -f "$docker_compose_file_location" up -d "$service"
            if [ $? -eq 0 ]; then
                echo "Service '$service' started."
            else
                echo "Failed to start service '$service'."
            fi
        else
            echo "Service '$service' is already running."
        fi
    done

    # Check the environment variables
    if [ "$NODE_ENV" == "development" ]; then
        echo "NODE_ENV is set to 'development'. Starting development services..."
        yarn start:dev
        # Add more services as needed
    fi
}

start_services
