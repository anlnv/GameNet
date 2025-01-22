# Use Node.js for building the app
FROM node:22-alpine as builder

WORKDIR /app

# Install dependencies and build the app
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN NEXT_PRIVATE_TURBOPACK=true npm run build

# Use lightweight image for production
FROM node:22-alpine as runner

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm ci --production

EXPOSE 3000

CMD ["npm", "start"]
