#!/usr/bin/env node

const program = require('commander');
const imageMinifier = require('imagemin');
const mozJPEG = require('imagemin-mozjpeg');
const {findImageFiles} = require('./lib/search');

// Add and parse command line options
program.arguments('<source> [destination]')
    .option('-i, --input <directory>', 'Input directory for images.')
    .option('-o, --output <directory>', 'Output directory for saved images.')
    .option('-v, --verbose', 'Program verbose mode.', false);

program.parse(process.argv);

// If user does not specify the source and or destination directories by flags
// but by simple raw arguments, we can still handle this.
if (program.input === undefined && typeof program.args[0] !== 'undefined') {
  program.input = program.args[0];

  // lets splice arguments as we already used the first argument to be
  // assigned to the program input
  program.args.splice(0, 1);
}

if (program.output === undefined && typeof program.args[0] !== 'undefined') {
  program.output = program.args[0];

  // do the same for the 'output' option
  program.args.splice(0, 1);
}

// TODO: maybe use this for debug option
// console.log(program.input, program.output, program.verbose);

findImageFiles(program.input).then((files) => {
  console.log(typeof files, files);

  // eslint-disable-next-line max-len
  imageMinifier(files, {
    destination: program.output,
    plugins: [mozJPEG()],
  }).then(() => {
    console.log('Images optimized');
  });
});
