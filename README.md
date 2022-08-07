# jewel.cash
*Receive payments and donations through Crypto. Get payed out in Fiat!*

## The app

This repository consists of several components:
* `Core` - contains all the shared logic and models.
* `Frontend` - contains the [React](https://reactjs.org) frontend code.
* `Backend` - contains the [Express](https://expressjs.com) backend code.

All components are tied together using [Lerna](https://lerna.js.org).

## Commands

Each component has inividual commands specified in the component's `package.json` file. These commands can easily be run by directing your terminal window to the root folder of that component.

There are also commands that will run for all components. These can be run from the root of the repository. Basically this will try to run a command with a similar name for each individual component, skipping the component if that specific command is not present.

Below is a (non-exhaustive) list of available commands:
* `npm run start` - start up the project in debug mode.
* `npm run build` - compile the TypeScript code for deployment.
* `npm run test` - runs the [Jest](https://jestjs.io) unit tests.
* `npm run lint` - runs [ESLint](https://eslint.org) to check for bugs and code conventions.

*This repository is not open source! Copyright (c) 2022 jewel.cash*