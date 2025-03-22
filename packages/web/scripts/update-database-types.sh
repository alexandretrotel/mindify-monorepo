#!/bin/bash

source .env

supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > ./src/types/supabase.ts

echo "Database types updated successfully!"