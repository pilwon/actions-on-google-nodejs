[![NPM](https://nodei.co/npm/actions-on-google-ts.png?downloads=false&stars=false)](https://npmjs.org/package/actions-on-google-ts) [![NPM](https://nodei.co/npm-dl/actions-on-google-ts.png?months=6)](https://npmjs.org/package/actions-on-google-ts)

`actions-on-google-ts` is a [TypeScript](https://www.typescriptlang.org/) fork of the official [Cient library for Actions on Google using Node.js (actions-on-google)](https://github.com/actions-on-google/actions-on-google-nodejs).


## Usage

    npm install actions-on-google-ts


## Develop

    git checkout ts
    npm install
    npm run build
    # npm run clean

### Sync with upstream

    git remote add upstream https://github.com/actions-on-google/actions-on-google-nodejs
    git fetch upstream
    git checkout master
    git merge upstream/master