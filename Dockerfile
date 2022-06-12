FROM node:18

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN npm install

COPY ["src/frontend/*.json", "./src/frontend/"]

WORKDIR /app/src/frontend

RUN npm install

WORKDIR /app

COPY . .

RUN ["npm", "run", "build-frontend-linux"]
RUN ["npm", "run", "build-server"]

CMD ["node", "build/server/server.js"]