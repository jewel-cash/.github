# jewl.app
[![Frontend](https://img.shields.io/website?down_color=red&down_message=down&label=frontend&logo=react&logoColor=white&up_color=green&up_message=up&url=https%3A%2F%jewl.app)](https://jewl.app/)
[![Backend](https://img.shields.io/website?down_color=red&down_message=down&label=backend&logo=express&logoColor=white&up_color=green&up_message=up&url=https%3A%2F%2Fjewl.app%2Fapi)](https://jewl.app/api/)

## The app

This repository consists of several components:
* `Core` - contains all the shared logic and models.
* `Web` - contains the [React](https://reactjs.org) frontend code.
* `API` - contains the [Express](https://expressjs.com) backend code.
* `Lambda` - contains the code for [Functions](https://docs.digitalocean.com/products/functions/). 

All components are tied together using [Nx](https://nx.dev). jewl.app uses a [MongoDB](https://www.mongodb.com) NoSQL database.

## Third Party tools

This repository uses a couple of third party services:
* The deployments are hosted on [DigitalOcean](https://digitalocean.com).
* Authentication and authorization are managed by [Auth0](https://auth0.com).
* Secure financial payments are managed through [Stripe](https://stripe.com).
* Crypto transactions and purchases are managed through [Coinbase](https://coinbase.com).

## Getting Started

Getting set up with this repository is very easy.
* Install node and MongoDB - `brew install node mongodb-community`.
* Start MongoDB server - `brew services start mongodb-community`.
* Clone this repository `git clone https://github.com/jewl-app/.github`.
* Create the `.env` files for each component that you want to run.
* Install dependencies using npm - `npm install`.
* Run one of the commands below - `npm run start`.

## Commands

Each command will be resolved for all components. These can be run from the root of the repository. Basically this will try to run a command with a similar name for each individual component, skipping the component if that specific command is not present.

Below is a (non-exhaustive) list of available commands:
* `npm run start` - start up the individual packages (separate instances).
* `npm run watch` - start up the frontend and backend server and watch for changes in the source files.
* `npm run build` - compile the TypeScript code for deployment or serving.
* `npm run test` - runs the [Jest](https://jestjs.io) unit tests.
* `npm run lint` - runs [ESLint](https://eslint.org) to check for bugs and code conventions.

If you look closely, the commands in the root of the repository just call individual commands specified in the component's `package.json` file. These commands should not be run by themselves as it will not resolve the right dependencies and will not execute the prerequisites. Instead you can specify which app to run with `--projects web`, `--projects api` or `--projects lambda`.

*Copyright © 2023 jewl.app*
