# Use the official Node.js image as a base image
FROM node:19.9.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Run npm install to install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3001
ENV PORT=3001

# Use environment variables
ENV MONDAY_SIGNING_SECRET=${MONDAY_SIGNING_SECRET}
ENV TUNNEL_SUBDOMAIN=${TUNNEL_SUBDOMAIN}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Command to run the application
CMD [ "npm", "run", "docker" ]
