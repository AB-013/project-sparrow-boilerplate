# pull official base image
FROM node:18.14.2 as build

# set working directory
WORKDIR /app

# copying tsconfig.json and tsconfig.build.json
COPY ./tsconfig*.json ./

# copying package.json and package-lock.json
COPY ./package*.json ./

# install dependencies
RUN npm ci --silent

#set node_env to production
ENV NODE_ENV production

# copy nest-cli file for build command
COPY ./nest-cli.json ./

# copying src
COPY ./src ./src

# make build
RUN npm run build

# make prod image
FROM node:18.14.2-alpine3.16 as prod

# set working directory
WORKDIR /app

# copying node_modules
COPY --from=build /app/node_modules/ /app/node_modules/

# copying dist
COPY --from=build /app/dist /app/dist

#set node_env to production
ENV NODE_ENV production

# expose port
EXPOSE 3000

CMD ["node","dist/main"]