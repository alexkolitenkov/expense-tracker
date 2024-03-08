import User               from '../../domain-model/User.js';
import { UserService }    from '../services/UserService.js';
import { inlineKeyboard } from '../utils.js';

const { NONE } = User.STATE_TYPES;

const userService = new UserService();

export async function cancelCommand(user, msg, bot) {
    const chatId = msg.chat.id;

    try {
        if (user.state === NONE) {
            return;
        }

        await userService.updateUserState(user.id, NONE);
    } catch (err) {
        console.error(err);
    }

    bot.sendMessage(
        chatId,
        'Cancelling current operation...'
    );
    setTimeout(inlineKeyboard, 1000, bot, chatId);
}
