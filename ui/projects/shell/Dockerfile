#######################
## DEVELOPMENT STAGE ##
#######################
# specify node verson and image
# also choose a unique name to target later
FROM node:18-alpine As development

# specify working directory inside container
WORKDIR /usr/src/app

# copy all package*-files into container
# (container is WORKDIR)
# (package.json, package-lock.json)
COPY package*.json ./

# install dev dependencies only
RUN npm i && npm i -g @angular/cli

# bundle app sources
COPY . .

## build everything to dist folder
RUN ng build shell --configuration=production

EXPOSE 4200

CMD ["ng", "serve", "shell" ,"--host","0.0.0.0","--poll", "500","--port" ,"4200"]

######################
# PRODDUCTION STAGE ##dir
######################
FROM nginx:1.21.3 as production

# defined new variable with default value
ARG NODE_ENV=production

# set variable to environment
ENV NODE_ENV=${NODE_ENV}

# copy from previous stage
COPY --from=development /usr/src/app/dist/shell/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# run commands
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
