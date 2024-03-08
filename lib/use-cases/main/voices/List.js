import UseCaseBase from '../../Base.js';
import Meme        from '../../../domain-model/Meme.js';

export class List extends UseCaseBase {
    static validationRules = {
        limit   : [ 'positive_integer', { default: 4 } ],
        offset  : [ 'integer', { 'min_number': 0 }, { default: 2 } ],
        sortBy  : [ { 'one_of': [ 'createdAt', 'updatedAt', 'name' ] }, { default: 'updatedAt' } ],
        orderBy : [ { 'one_of': [ 'ASC', 'DESC' ] }, { default: 'ASC' } ]
    }

    async execute({ limit, offset, sortBy, orderBy }) {
        console.log(limit, offset, sortBy, orderBy);
        const memes = await Meme.findAll({
            limit,
            offset,
            order : [ [ sortBy, orderBy ] ]
        });


        return memes;
    }
}
