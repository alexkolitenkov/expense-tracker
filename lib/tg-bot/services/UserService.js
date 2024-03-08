import User from '../../domain-model/User.js';

export class UserService {
    async findOrCreate(id, username) {
        const [ user ] = await User.findOrCreate({
            where    : { id },
            defaults : {
                id,
                username
            }
        });

        return user;
    }

    async show(id) {
        const user = await User.scope([ { method: [ 'id', id ] } ]).findOne();

        return user;
    }

    async updateUserState(id, state) {
        const updatedUser = await User.scope([ { method: [ 'id', id ] } ]).update({ state });

        return updatedUser;
    }
}
