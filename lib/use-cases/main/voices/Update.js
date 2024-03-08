import UseCaseBase from '../../Base.js';
import Meme        from '../../../domain-model/Meme.js';

export class Update extends UseCaseBase {
    static validationRules = {
        id          : [ 'string', 'required', 'positive_integer' ],
        name        : [ 'string', { 'max_length': 255 } ],
        description : [ 'string', { 'max_length': 255 } ],
        title       : [ 'string', { 'max_length': 255 } ]
    }

    async execute(data) {
        // const meme = await Meme.findById(data.id);
        const meme = await Meme.scope([ { method: [ 'id', data.id ] } ]).findById(data.id);
        const updatedMeme = await meme.update(data);


        return updatedMeme;
    }
}
