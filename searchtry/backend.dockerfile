FROM node:20   
WORKDIR /home/searchtry


COPY package* ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
COPY package.json ./
COPY package-lock.json ./



RUN npm run build

EXPOSE 3001

CMD ["npm","run","start"]
