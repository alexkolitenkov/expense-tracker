import { UserService }    from '../services/UserService.js';
import { inlineKeyboard } from '../utils.js';

const userService = new UserService();

export async function startCommand(user, msg, bot) {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    try {
        if (!user) {
            await userService.findOrCreate(chatId, username);
        }
    } catch (err) {
        console.error(err);
    }

    inlineKeyboard(bot, chatId);
}
