/* eslint-disable import/no-commonjs */

module.exports = {
    nodeArguments : [
        '--experimental-modules',
        '--experimental-json-modules'
    ],
    serial  : true,
    verbose : false,
    files   : [
        'tests/index.test.js'
    ],
    concurrency          : 1,
    timeout              : '1m',
    environmentVariables : {
        MODE : 'test'
    }
};
