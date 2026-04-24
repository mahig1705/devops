FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]