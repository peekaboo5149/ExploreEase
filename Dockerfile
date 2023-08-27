# Use an official Node.js runtime as the base image
FROM node:16 AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nest.js application
RUN npm run build

# Production Stage
FROM node:16 AS production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production
RUN npx prisma generate


# Copy the built application from the development stage
COPY --from=development /app/dist ./dist

# Expose the port your Nest.js app runs on
EXPOSE 5000

# Command to run the Nest.js application
CMD [ "node", "dist/src/main" ]
