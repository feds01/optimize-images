#!/usr/bin/env node

const prompt = require('prompt');
const program = require('commander');
const chalk = require('chalk');
const path = require('path');

const {findImageFiles} = require('./lib/search');
const {transformImages, fileSizeDifference} = require('./lib/image');

program.name('optimise-image');
program.version('v0.0.1');

program.arguments('<source> <destination>')
    .option('-i, --input <directory>', 'Input directory for images.')
    .option('-o, --output <directory>', 'Output directory for saved images.')
    .option('-v, --verbose', 'Program verbose mode.', false);

program.parse(process.argv);

// If user does not specify the sources and or destination directories by flags
// but by raw arguments, we can still handle this.
if (program.input === undefined && typeof program.args[0] !== 'undefined') {
  program.input = path.resolve(program.args[0]);

  // lets splice the arguments as we already used the first argument to be
  // assigned to the program input
  program.args.splice(0, 1);
}

if (program.output === undefined && typeof program.args[0] !== 'undefined') {
  program.output = path.resolve(program.args[0]);

  // do the same for the 'output' option
  program.args.splice(0, 1);
}

// If verbose not specified, set it to 'false' by default
if (program.verbose === undefined) {
  program.verbose = false;
}

// eslint-disable-next-line max-len
const images = findImageFiles(path.resolve(program.input), program.verbose);

// Start the prompt
prompt.start();
// Get two properties from the user: username and email
prompt.get([{
  name: 'confirmation',
  description: chalk.green('Optimise images [y/N] ?'),
  type: 'string',
  message: 'Confirmation must be a "y" or "n"',
  required: true,
  conform: (value) => {
    return ['y', 'n'].includes(value.toLowerCase());
  },
}], (err, result) => {
  if (result.confirmation.toLowerCase() === 'y') {
    transformImages(images, program.output).then((k) => {
      let savedSpace = 0;

      k.forEach((item) => {
        savedSpace += fileSizeDifference(item.sourcePath, item.destinationPath);
      });

      // Convert size into megabytes and round to two decimal figures.
      savedSpace = (savedSpace/ 1E6).toFixed(2);

      if (program.verbose) console.log(`total space saved from optimisation ${chalk.green.bold(savedSpace)}Mb.`);

      console.log('optimised image files were written to ' + program.output);
    }).catch((err) => {
      console.log('err: ', err);
      process.exit(-1);
    });
  }
});
