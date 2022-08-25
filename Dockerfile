FROM node:16 as base

WORKDIR /app
COPY ./package.json .
RUN yarn
COPY . .
RUN yarn prisma generate

FROM base as test
ENTRYPOINT ["/app/run-tests.sh"]
