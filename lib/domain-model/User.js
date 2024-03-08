import sequelize from 'sequelize';
import Base      from './Base.js';
import Meme      from './Meme.js';

const { DataTypes: DT } = sequelize;

class User extends Base {
    static RELATION_TYPES = {
        memes : 'memes'
    }

    static STATE_TYPES = {
        MEME_SENDING  : 'MEME_SENDING',
        MEME_DELETING : 'MEME_DELETING',
        NONE          : 'NONE'
    }

    static options = {
        scopes : {
            id(id) {
                if (!id) return {};

                return { where: { id } };
            }
        }
    }

    static schema = {
        id        : { type: DT.BIGINT, allowNull: false, primaryKey: true },
        username  : { type: DT.STRING, allowNull: true },
        state     : { type: DT.ENUM('MEME_SENDING', 'MEME_DELETING', 'NONE'), allowNull: false, defaultValue: 'NONE' },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.hasMany(Meme, { as: this.RELATION_TYPES.memes, foreignKey: 'userId' });
    }
}

export default User;
