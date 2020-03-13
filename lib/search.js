#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * @version 0.0.1
 * @description This function checks the current directory and looks
 * for files that have a 'jpg' file extension.
 *
 * @param {string} root The root directory to begin searching for images.
 * @param {boolean} verbose Flag to state if search should be verbose.
 * @return {Array<String>} paths of images that are found.
 * */
function findImageFiles(root, verbose) {
    const images = [];

    try {
        fs.readdirSync(root)
            .filter((file) => RegExp('^.*.jpg$').test(file))
            .forEach((file) => {
                const imageFile = path.join(root, file);

                if (verbose) console.log((`found: ${chalk.cyan(file)}`));
                images.push(imageFile);
            });
    } catch (e) {
        console.log(e);
        process.exit(-1);
    }

    if (verbose) console.log(chalk.cyan.bold(`found a total of ${images.length} files`));

    return images;
}

module.exports = {
    findImageFiles: findImageFiles,
};
