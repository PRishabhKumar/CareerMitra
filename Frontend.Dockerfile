# Stage 1: Build
FROM node:20-alpine as build-stage
WORKDIR /app
COPY ./Frontend/careermitra-frontend/package*.json ./
RUN npm install
COPY ./Frontend/careermitra-frontend/ ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]