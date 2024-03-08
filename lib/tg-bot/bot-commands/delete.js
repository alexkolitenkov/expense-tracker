import { UserService } from '../services/UserService.js';
import User            from '../../domain-model/User.js';
import Meme            from '../../domain-model/Meme.js';

const { MEME_DELETING, NONE } = User.STATE_TYPES;
const userService = new UserService();

export async function deleteCommand(user, msg, bot) {
    const chatId = msg.chat.id;

    await userService.updateUserState(user.id, MEME_DELETING);

    bot.sendMessage(
        chatId,
        'Provide name of meme you want to delete'
    );
}

export async function deleteHandler(user, msg, bot) {
    const chatId = msg.chat.id;

    try {
        if (user.state === MEME_DELETING && msg.text) {
            const memeTitle = msg.text;

            try {
                const deleted = await Meme.scope([ { method: [ 'title', memeTitle ] }, { method: [ 'userId', user.id ] } ]).destroy();
                const resultMessage = deleted ? 'Meme was deleted successfully!' : 'You don\'t have such a meme. Try another name or type /cancel.';

                await userService.updateUserState(user.id, deleted ? NONE : user.state);
                bot.sendMessage(chatId, resultMessage);
            } catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.error(err);
    }
}
