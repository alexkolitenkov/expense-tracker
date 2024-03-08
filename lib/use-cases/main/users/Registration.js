import UseCaseBase     from '../../Base.js';
import Meme            from '../../../domain-model/Meme.js';
import { dumpContext } from '../utils/dumps.js';

export class Registration extends UseCaseBase {
    static validationRules = {
        email     : [ 'required', 'email', { 'max_length': 255 } ],
        firstName : [ 'required', 'string', { 'max_length': 255 } ],
        password  : [ 'required', 'string', { 'length_between': [ 8, 25 ] } ]
    }

    async execute({ email, firstName, password }) {
        const user = await Meme.create({
            name      : firstName,
            email,
            password,
            diskSpace : 5000,
            usedSpace : 0
        });

        console.log(this);

        return {
            context : dumpContext(user, this.context.useragent)
        };
    }
}
