const chalk = require('chalk');

const info = chalk.blue;
const warn = chalk.yellow;
const error = chalk.bold.red.inverse;

module.exports = {
    info: (message) => console.info(info(message)),
    warn: (message) => console.warn(warn(message)),
    error: (message) => console.error(error(message)),
};