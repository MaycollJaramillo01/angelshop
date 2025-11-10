FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY src ./src
COPY index.html ./
CMD ["npm", "run", "dev"]
