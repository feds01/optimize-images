#!/usr/bin/env node

const prompts = require('prompts');
const program = require('commander');
const chalk = require('chalk');
const path = require('path');

const {findImageFiles} = require('./lib/search');
const {transformImages, fileSizeDifference} = require('./lib/image');

program.name('optimise-image');
program.version('v0.0.1');

program.arguments('<source> <destination>')
    .option('-i, --input <directory>', 'Input directory for images.')
    .option('-q --quality <number>', 'The quality of optimisation applied to images.', 70)
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

// validate quality argument
if (typeof program.quality !== 'number') {
    try {
        program.quality = parseInt(program.quality);

        if (!Number.isInteger(program.quality)) {
            console.log(chalk.red('Error: Quality level must be an integer.'));
            process.exit(-1);
        }

        if (program.quality < 0 || program.quality > 100) {
            console.log(chalk.red('Error: Quality level must be within range of 0-100'));
            process.exit(-1);
        }
    } catch (e) {
        console.log(chalk.red('Error: Quality level must be an integer'));
        process.exit(-1);
    }
}

// If verbose not specified, set it to 'false' by default
if (typeof program.verbose === 'undefined') {
    program.verbose = false;
}

// If user doesn't provide any kind of arguments to program, we can't assume anything
// and therefore must stop the program.
if (typeof program.input === 'undefined') {
    console.log(chalk.red('Error: No specified input directory.'));
    process.exit(-1);
}


(async () => {
    const images = findImageFiles(path.resolve(program.input), program.verbose);
    let outputQuery = {};

    if (typeof program.output === 'undefined') {
        outputQuery = {
            name: 'output',
            initial: 'optimised_images',
            message: chalk.green('write optimised images to:'),
            type: 'text',
            validate: (value) => {
                if (value === null || value.match(/^ *$/) !== null) {
                    return 'Directory cannot be whitespaces.';
                } else {
                    return true;
                }
            },
        };
    }

    const response = await prompts([
        outputQuery,
        {
            name: 'confirmation',
            type: 'confirm',
            message: 'Optimise images?',
        }]);

    // now that we confirmed with user where we should write the files, write them to
    // the specified directory in prompt.
    if (typeof program.output === 'undefined') {
        program.output = path.resolve(response.output);
    }

    if (response.confirmation) {
        transformImages(images, program.output, program.quality).then((k) => {
            let savedSpace = 0;

            k.forEach((item) => {
                savedSpace += fileSizeDifference(item.sourcePath, item.destinationPath);
            });

            // Convert size into megabytes and round to two decimal figures.
            savedSpace = (savedSpace / 1E6).toFixed(2);

            if (program.verbose) console.log(`total space saved from optimisation ${chalk.green.bold(savedSpace)}Mb.`);

            console.log('optimised image files were written to ' + program.output);
        }).catch((err) => {
            console.log('err: ', err);
            process.exit(-1);
        });
    }
})();
