# Certificate stage
FROM alpine:3.18.2 as certificates
ARG PRIVATE_TOKEN
ARG SERVICE_NAME
ARG STAGE
RUN echo "PRIVATE_TOKEN: ${PRIVATE_TOKEN}"
RUN apk --no-cache add curl
RUN curl -H "Authorization: token $PRIVATE_TOKEN" -o .env https://raw.githubusercontent.com/Quan0308/Study-planner-env/main/${STAGE}/.env

# Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# Production dependencies stage
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Final stage
FROM node:20-alpine
ENV BUILD_PATH='./src/dist'

WORKDIR /src

COPY --from=prod-deps /app/node_modules /src/node_modules
COPY --from=build /app/dist /src/dist
COPY --from=certificates .env /src/.env

COPY ./*.js /src/
COPY ./*.json /src/
COPY ./*.lock /src/
COPY ./apps/${SERVICE_NAME} /src/apps/${SERVICE_NAME}
COPY ./libs /src/libs

RUN echo "building service: ${SERVICE_NAME} with stage: ${STAGE}"

EXPOSE 8000

RUN echo "#!/bin/sh" > /usr/local/bin/entrypoint.sh && \
  echo "ENV=${STAGE} node /src/dist/apps/${SERVICE_NAME}/main.js" >> /usr/local/bin/entrypoint.sh && \
  chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]