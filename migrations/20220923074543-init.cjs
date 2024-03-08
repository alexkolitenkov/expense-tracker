module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id        : { type: Sequelize.BIGINT, allowNull: false, primaryKey: true },
            username  : { type: Sequelize.STRING, allowNull: true },
            state     : { type: Sequelize.ENUM('MEME_SENDING', 'MEME_DELETING', 'NONE'), allowNull: false, defaultValue: 'NONE' },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable('Memes', {
            id        : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            userId    : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
            fileId    : { type: Sequelize.STRING, allowNull: false },
            title     : { type: Sequelize.STRING, allowNull: false },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Memes');
        await queryInterface.dropTable('Users');
    }
};
