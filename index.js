const chalk = require('chalk');
const {findImageFiles} = require('./lib/search');

console.log(chalk.yellow(`Welcome to optimize-images@v0.0.1`));

// process.argv.forEach((arg) => console.log(arg));
findImageFiles(process.argv[2]);

