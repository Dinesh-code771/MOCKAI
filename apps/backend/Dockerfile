FROM node:22 AS build

WORKDIR /app

RUN apt-get update 

COPY package.json ./package.json

RUN yarn install

COPY . .

FROM node:22-slim

WORKDIR /app

RUN apt-get update

RUN apt-get install openssl -y

COPY --from=build /app/package.json ./package.json

COPY --from=build /app/dist ./dist

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/certificates/ca.pem ./certificates/ca.pem

COPY --from=build /app/certificates/apple_private_key.p8 ./certificates/apple_private_key.p8

COPY --from=build /app/views ./dist/views

COPY --from=build /app/assets ./dist/assets

COPY --from=build /app/@babel ./node_modules/@babel

COPY --from=build /app/date-fns ./node_modules/date-fns

COPY --from=build /app/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]