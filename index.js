// const chalk = require('chalk');
// const {transformImages} = require('./lib/image');
const {findImageFiles} = require('./lib/search');
//
// console.log(chalk.yellow(`Welcome to optimize-images@v0.0.1`));
//
// // process.argv.forEach((arg) => console.log(arg));
// findImageFiles(process.argv[2]).then((files) => {
//   transformImages(files, __dirname + '\\out').then((result) => {
//     console.log(result);
//   });
// });
//

const imageMinifier = require('imagemin');
const mozJPEG = require('imagemin-mozjpeg');

findImageFiles(process.argv[2]).then((files) => {
  console.log(typeof files, files);

  // eslint-disable-next-line max-len
  imageMinifier(files, {destination: 'out/', plugins: [mozJPEG()]}).then(() => {
    console.log('Images optimized');
  });
});
