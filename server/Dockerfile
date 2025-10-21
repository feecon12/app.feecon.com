FROM node:18

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm install

# Copy only the server source files
COPY . .

RUN npm run build

EXPOSE 3001

# Run the compiled JavaScript file
CMD ["node", "dist/server.js"]