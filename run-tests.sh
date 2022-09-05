#!/bin/bash

npx nx run-many --target=test --all=true
npx prisma migrate dev
npx nx run infrastructure:test-integration
