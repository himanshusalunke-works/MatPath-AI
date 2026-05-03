# Step 1: Build the React app
FROM node:20-slim as build

WORKDIR /app

COPY package*.json ./
RUN npm install



COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Support Cloud Run dynamic port
RUN printf "server {\n  listen 8080;\n  location / {\n    root /usr/share/nginx/html;\n    index index.html index.htm;\n    try_files \$uri \$uri/ /index.html;\n  }\n}\n" > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
