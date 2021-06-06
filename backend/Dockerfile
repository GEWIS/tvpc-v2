# We build our container using node:13-alpine
FROM node:13-alpine AS builder
ENV NODE_ENV=development

# Change dir to install dir.
WORKDIR /usr/src/tvpc-v2-backend

# Copy over the package and package-lock
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy over the tsconfig
COPY tsconfig.json .

# Copy over the source files
COPY src /usr/src/tvpc-v2-backend/src/

# Transpile the typescript files
RUN npm run build



# Create production container.
FROM node:13-alpine

# Set correct dir.
WORKDIR /usr/src/tvpc-v2-backend

# Copy over the package and package-lock
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy over the user data
COPY data /usr/src/tvpc-v2-backend/data/

# Copy over the source files from the builder
COPY --from=builder /usr/src/tvpc-v2-backend/dist ./src/

# Set correct priv.
RUN chown -R node:node .
USER node

EXPOSE 9139
CMD ["node", "src/app.js"]
