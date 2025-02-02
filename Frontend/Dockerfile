# Use an official Node.js image for building the frontend
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock (since you're using Yarn for the frontend)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the React app
RUN yarn build

# Use Nginx for serving the frontend
FROM nginx:latest

# Set working directory inside Nginx
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static files
RUN rm -rf ./*

# Copy built frontend files from the previous stage
COPY --from=build /app/build .

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
