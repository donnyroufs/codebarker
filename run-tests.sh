docker-compose -f docker-compose.test.yml up -d
sleep 5
npx nx affected --target=test --parallel --max-parallel=2
npx nx affected --target=test-integration 
docker-compose down