FROM node

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PW=qwerty

RUN mkdir -p docker-testapp-main

COPY . ./docker-testapp-main

CMD ["node", "docker-testapp-main/server.js"]