# Stage 1: Build Angular app
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve using nginx
FROM nginx:alpine

COPY --from=build /app/www /usr/share/nginx/html

EXPOSE 80