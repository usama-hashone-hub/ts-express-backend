# Use Node.js image
FROM node:20.12.2-alpine

# Set working directory
WORKDIR /usr

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy all application files and build the app
COPY . .
RUN npm run build --legacy-peer-deps

# Expose the port and run the app
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
