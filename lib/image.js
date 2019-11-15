const imageMinifier = require('imagemin');
const mozJPEG = require('imagemin-mozjpeg');

/**
 * @version v0.0.1
 *
 * @description Transform JPEG image sources and output transformations
 * * to the 'dest' folder.
 *
 * @param {Array<string>} sources images sources to be transformed into
 * optimised JPEG.
 * @param {string} destination path to destination folder.
 * @return {undefined}
 * */
function transformImages(sources, destination) {
  console.log(typeof sources, sources);

  // eslint-disable-next-line max-len
  imageMinifier(sources, {destination, plugins: [mozJPEG()]}).then(() => {
    console.log('Images optimized');
  });
}


module.exports = {
  transformImages: transformImages,
};
