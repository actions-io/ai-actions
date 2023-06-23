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
EXPOSE 3002
ENV PORT=3002

# Use environment variables
ENV MONDAY_API_KEY=${MONDAY_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV CLIENT_SECRET=${CLIENT_SECRET}

# Command to run the application
CMD [ "npm", "run", "dev" ]
