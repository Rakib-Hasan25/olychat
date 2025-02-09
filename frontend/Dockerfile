FROM node:20   

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy all the application files
COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]






# FROM node:20   
# WORKDIR /home/searchtry


# COPY package* ./
# RUN npm install

# COPY src ./src
# COPY tsconfig.json ./
# COPY package.json ./
# COPY package-lock.json ./



# RUN npm run build

# EXPOSE 3001

# CMD ["npm","run","start"]
