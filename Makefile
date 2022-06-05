branch ?= staging

pscale-up:
	pscale connect codebarker $(branch) --port 3309

db-push:
	yarn prisma db push

db-reset:
	yarn prisma migrate reset --force --skip-generate

db-new:
	$(MAKE) db-reset
	$(MAKE) db-push
	yarn db:seed

cloc:
	cloc --exclude-dir=node_modules,dist --exclude-lang=JavaScript,JSON . 