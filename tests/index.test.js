/* eslint-disable import/no-unresolved */

import test             from 'ava';
import config           from '../lib/config.cjs';
import * as DomainModel from './../lib/domain-model/index.js';

// import * as server from './server.js';
import unitTests from './unit/index.js';

let tests = [
    ...unitTests
];

if (tests.find(({ only }) => only)) {
    tests = tests.filter(({ only }) => only);
}

// test.before(async () => {
//     server.start();
// });
DomainModel.initModels(config['test-db']);

for (const item of tests) {
    test.serial(item.label, async (t) => {
        let exception = null;

        const baseTestParams = {
            t
        };

        try {
            const { sequelize } = await DomainModel.initModels(config['test-db']);

            await sequelize.transaction(async t1 => {
                let prevResult = {};

                try {
                    global.testTransaction = t1;
                    t1.webhooks = []; // eslint-disable-line no-param-reassign

                    if (item.before) {
                        const result = await item.before({ ...baseTestParams, ...prevResult });

                        prevResult = result;
                    }

                    prevResult = prevResult || {};

                    if (item.test) {
                        try {
                            const testResult = await item.test({ ...baseTestParams, ...prevResult }) || {};

                            if (testResult) {
                                prevResult = { ...prevResult, ...testResult };
                            }
                        } catch (e) {
                            console.error(e);

                            exception = e;
                        }
                    }

                    if (item.after) {
                        await Promise.all(t1.webhooks.map(func => func()));
                        prevResult = await item.after({ ...baseTestParams, ...prevResult }) || {};
                    }

                    if (exception) {
                        throw exception;
                    }
                } catch (error) {
                    console.log(error);

                    throw error;
                } finally {
                    global.testTransaction = null;
                    await t1.rollback();
                }
            });
        } catch (error) {
            if (!error.message || !error.message.match(/rollback/)) {
                throw error;
            }
        }
    });
}

// test.after(async () => {
//     await server.stop();
// });
