FROM oven/bun

WORKDIR /app
COPY . .

RUN bun install

EXPOSE 3000
CMD ["bun", "run", "src/server/socketServer.ts"]
