#!/bin/bash

npx nx run-many --target=test --all
npx prisma migrate dev
sleep 2
npx nx run infrastructure:test-integration --runInBand