FROM  node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app


COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/


RUN npm install 
RUN cd backend && npm install
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build

EXPOSE 5000


CMD ["npm", "run", "start:backend"]