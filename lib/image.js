#!/usr/bin/env node

const fs = require('fs');
const imageMinifier = require('imagemin');
const mozJPEG = require('imagemin-mozjpeg');

/**
 * @version v0.0.1
 *
 * @description Transform JPEG image sources and output transformations
 * * to the 'dest' folder.
 *
 * @param {Array<string>} sources image sources to be transformed into
 * optimised JPEG.
 * @param {string} destination path to destination folder.
 * @param {Number} quality percentage quality that minifier should apply to images.
 * @return {Promise}
 * */
function transformImages(sources, destination, quality) {
    try {
        return imageMinifier(sources, {
            destination: destination,
            quality: quality,
            glob: false,
            plugins: [
                mozJPEG({
                    quality,
                    quantTable: 3,
                    doScanOpt: 2,
                }),
            ],
        });
    } catch (e) {
        console.log(e.message);
        process.exit(-1);
    }
}


/**
 * @version v0.0.1
 *
 * @description Function returns the difference in size between provided files
 *
 * @param {String} file1 Left hand side file in size comparison.
 * @param {String} file2 Right hand side file in size comparison.
 * @return {number} difference in files sized in bytes.
 * */
function fileSizeDifference(file1, file2) {
    const stat1 = fs.statSync(file1);
    const stat2 = fs.statSync(file2);

    return Math.abs(stat1.size - stat2.size);
}


module.exports = {
    transformImages,
    fileSizeDifference,
};
