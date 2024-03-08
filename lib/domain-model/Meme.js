import sequelize from 'sequelize';
import Base      from './Base.js';
import User      from './User.js';

const { DataTypes: DT } = sequelize;

class Meme extends Base {
    static RELATION_TYPES = {
        user : 'user'
    }

    static options = {
        scopes : {
            id(id) {
                if (isNaN(id)) return {};

                return { where: { id } };
            },
            userId(userId) {
                if (!userId) return {};

                return { where: { userId } };
            },
            title(title) {
                if (!title) return {};

                return { where: { title } };
            },
            fileId(fileId) {
                if (!fileId) return {};

                return { where: { fileId } };
            }
        }
    }

    static schema = {
        id        : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        userId    : { type: DT.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
        fileId    : { type: DT.STRING, allowNull: false },
        title     : { type: DT.STRING, allowNull: false },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.belongsTo(User, { as: this.RELATION_TYPES.user, foreignKey: 'userId' });
    }
}

export default Meme;
