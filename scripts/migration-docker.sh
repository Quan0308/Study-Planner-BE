#!/bin/bash 
echo "Starting migration" 
 
# Find all typeorm.config.ts files matching the pattern and store them in an array 
configs=($(find . -type f -name "typeorm.config.ts" -path "*/apps/*-service/*")) 
 
# Iterate over the array and run the migration command for each config 
migration_validation=true 
for config in "${configs[@]}"; do 
    # Check if the migration is valid 
    if ! npx typeorm-ts-node-commonjs migration:run -d "$config"; then 
        migration_validation=false 
    fi 
done 
 
# Notfiy the user that the migration is complete 
if [ "$migration_validation" = false ]; then 
    echo "Migration failed" 
    exit 1 
fi 
echo "Migration complete"