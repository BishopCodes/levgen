#!/usr/bin/env node

const program = require('commander');
const handler = require('./src/env.handler');
const pjson = require('./package.json');

program.version(process.env.npm_package_version, '-v, --version', 'output current version');

program
    .option('--no-clobber', "Does not delete a value if no longer found during updates")
    .description('Makes .env.local from env section of package.json')
    .action(({clobber}) => {
    handler.makeConfig(pjson.env, clobber);
});

program.parse(process.argv);