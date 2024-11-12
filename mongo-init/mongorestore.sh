#!/bin/bash

# Wait for a few seconds to give MongoDB time to start
echo "Waiting for MongoDB to be ready..."
sleep 10  # Adjust the sleep time as needed

# Now run the mongorestore command
echo "MongoDB is up, starting mongorestore..."
mongorestore --host localhost --db mernapp --drop /data-bkp
echo "mongorestore completed"
