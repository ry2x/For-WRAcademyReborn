# Use the official Node.js image as a parent image
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-18

# Set the working directory
WORKDIR /workspace

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Set the default command to start the development server
CMD ["pnpm", "start"]
