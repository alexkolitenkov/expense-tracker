import test          from './test.js';
import startCommand  from './start.js';
import cancelCommand from './cancel.js';
import createCommand from './create.js';
import deleteCommand from './delete.js';

export default [
    ...test,
    ...createCommand,
    ...startCommand,
    ...cancelCommand,
    ...deleteCommand
];
