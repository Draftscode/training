FROM node:18-alpine AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /usr/src/app

ENV TZ=Europe/Berlin

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm install && \
    npm i -g @nestjs/cli

# Bundle app source / copy all other files
COPY . .
ARG APP_NAME

# Build the app to the /dist folder
RUN npm run build $APP_NAME

CMD ["npm","run","start:debug"]

################
## PRODUCTION ##
################
# Build another image named production
FROM node:18-alpine AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG LOCAL_PORT

# Set Working Directory
WORKDIR /usr/src/app

ENV TZ=Europe/Berlin

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy all from development stage
COPY --from=development /usr/src/app/ .

# RUN echo "dist/apps/$APP_NAME/main"

EXPOSE $LOCAL_PORT $LOCAL_MS_PORT

CMD ["node","dist/main"]