import UseCaseBase from '../../Base.js';
import Meme        from '../../../domain-model/Meme.js';

export class Create extends UseCaseBase {
    static validationRules = {
        name        : [ 'string', 'required', { 'max_length': 255 } ],
        description : [ 'string', { 'max_length': 255 } ],
        title       : [ 'string', { 'max_length': 255 } ]
    }

    async execute({ name, description, title }) {
        const meme = await Meme.create({ name, description, title });

        return { meme };
    }
}
