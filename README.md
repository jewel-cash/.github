# jewel.cash
[![Frontend](https://img.shields.io/website?down_color=red&down_message=down&label=frontend&logo=react&logoColor=white&up_color=green&up_message=up&url=https%3A%2F%2Fjewel.cash)](https://jewel.cash/)
[![Backend](https://img.shields.io/website?down_color=red&down_message=down&label=backend&logo=express&logoColor=white&up_color=green&up_message=up&url=https%3A%2F%2Fjewel.cash%2Fapi)](https://jewel.cash/api/)

## The app

This repository consists of several components:
* `Core` - contains all the shared logic and models.
* `Frontend` - contains the [React](https://reactjs.org) frontend code.
* `Backend` - contains the [Express](https://expressjs.com) backend code.

All components are tied together using [Nx](https://nx.dev) and uses a [MongoDB](https://www.mongodb.com) NoSQL database.

## Getting Started

Getting set up with this repository is very easy.
* Install node and MongoDB - `brew install node mongodb-community` (should work with node 16 or node 18).
* Start MongoDB server - `brew services start mongodb-community`.
* Clone this repository `git clone https://github.com/jewel-cash/.github`.
* Fill out the two `.env` files (one for frontend package and one for backend package).
* Install dependencies using npm - `npm install`.
* Run one of the commands below - `npm run start`.

## Commands

Each component has inividual commands specified in the component's `package.json` file. These commands can easily be run by directing your terminal window to the root folder of that component.

There are also commands that will run for all components. These can be run from the root of the repository. Basically this will try to run a command with a similar name for each individual component, skipping the component if that specific command is not present.

Below is a (non-exhaustive) list of available commands:
* `npm run start` - start up the frontend and backend server (separate instances).
* `npm run watch` - start up the frontend and backend server and watch for changes in the source files.
* `npm run build` - compile the TypeScript code for deployment or serving.
* `npm run test` - runs the [Jest](https://jestjs.io) unit tests.
* `npm run lint` - runs [ESLint](https://eslint.org) to check for bugs and code conventions.

*This repository is not open source. Copyright (c) 2022 jewel.cash*
