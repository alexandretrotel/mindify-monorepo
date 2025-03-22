#!/bin/bash

source .env

supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > ./src/common/types/supabase.ts

echo "Database types updated successfully!"