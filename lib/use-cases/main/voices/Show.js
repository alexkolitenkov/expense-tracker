import UseCaseBase from '../../Base.js';
import Meme        from '../../../domain-model/Meme.js';

export class Show extends UseCaseBase {
    static validationRules = {
        id : [ 'string', 'required', 'positive_integer' ]
    }

    async execute({ id }) {
        const meme = await Meme.scope([ { method: [ 'id', id ] } ]).findAll();

        return meme;
    }
}
