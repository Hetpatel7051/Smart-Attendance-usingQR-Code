FROM  node:18-alpine


WORKDIR /app


COPY package*.json ./
COPY backend/package*.json ./backend/


RUN npm install 
RUN cd backend && npm install


COPY . .


EXPOSE 5000


CMD ["npm", "run", "start:backend"]