FROM node:9-alpine
RUN mkdir -p /code
WORKDIR /code
ADD . /code
RUN yarn install --production && \
    yarn cache clean
CMD [ "yarn", "run", "start" ]