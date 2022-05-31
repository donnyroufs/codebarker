branch ?= staging

pscale-up:
	pscale connect codebarker $(branch) --port 3309

db-push:
	yarn prisma db push