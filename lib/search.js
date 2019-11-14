const fs = require('fs');
const chalk = require('chalk');

/**
 * This function checks the current directory and looks for files that have
 * a 'jpg' file extension.
 *
 * */
function findImageFiles() {
  fs.readdir(process.cwd(), (err, files) => {
    const imageRegex = RegExp('^.*.jpg$');

    files.forEach((file) => {
      if (imageRegex.test(file)) {
        console.log(chalk.blue(`found image file: ${process.cwd()}\\${file}`));
      }
    });
  });
};

module.exports = {
  findImageFiles: findImageFiles,
};
