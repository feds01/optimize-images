const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * @version 0.0.1
 * @description This function checks the current directory and looks
 * for files that have a 'jpg' file extension.
 *
 * @param {string} root The root directory to begin searching for images.
 * @return {Promise<Array<string>>} paths of images that are found.
 * */
async function findImageFiles(root) {
  const fullPath = path.resolve(root);
  const images = [];

  await fs.readdirSync(fullPath).forEach((file, err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log(chalk.red(err));
      } else {
        console.log(chalk.red(`Error reading path: ${fullPath}\n${err}`));
      }
      return;
    }

    const imageRegex = RegExp('^.*.jpg$');

    if (imageRegex.test(file)) {
      console.log(chalk.blue(`found image file: ${fullPath}\\${file}`));
      images.push(`${fullPath}\\${file}`);
    }
  });


  return images;
}

module.exports = {
  findImageFiles: findImageFiles,
};
