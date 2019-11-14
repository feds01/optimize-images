const chalk = require('chalk');
const {findImageFiles} = require('./lib/search');

console.log(chalk.yellow(`Welcome to optimize-images@0.0.1`));
findImageFiles();

