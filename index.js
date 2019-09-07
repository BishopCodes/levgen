#!/usr/bin/env node

const program = require('commander');
const handler = require('./src/env.handler');
const pjson = require('./package.json');

program.version(pjson.version, '-v, --version', 'output the version number');

program
    .option('-c, --clobber', 'should values in env file be removed if they no longer exist in config', false)
    .option('-n, --name [name]', 'override the output file name that env variables are written to', '.env.local')
    .description('Makes .env.local from env section of package.json')
    .action(({ name, clobber}) => {
        handler.makeConfig(clobber, name);
    });

program.parse(process.argv);