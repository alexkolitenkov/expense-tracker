import UseCaseBase from '../../Base.js';
import Meme        from '../../../domain-model/Meme.js';

export class Delete extends UseCaseBase {
    static validationRules = {
        id : [ 'string', 'required', 'positive_integer' ]
        // id : [ { 'list_or_one': [ 'positive_integer' ] }, 'to_array' ]
    }

    async execute({ id }) {
        // await Meme.destroy({ where: { id } });
        await Meme.scope([ { method: [ 'id', id ] } ]).destroy();

        return {};
    }
}
