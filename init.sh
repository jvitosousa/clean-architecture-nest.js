#!/bin/bash
npm install

npm run start:dev

npx typeorm-ts-node-commonjs migration:run -d src/infrastructure/config/typeorm/typeorm.config.ts