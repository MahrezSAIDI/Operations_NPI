FROM node:16 AS build

WORKDIR /app


COPY package*.json ./

# Installer les dépendances
RUN npm install


COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
