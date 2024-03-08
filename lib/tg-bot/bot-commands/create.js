import User            from '../../domain-model/User.js';
import Meme            from '../../domain-model/Meme.js';
import { UserService } from '../services/UserService.js';
import { MemeService } from '../services/MemeService.js';

const { MEME_SENDING, NONE } = User.STATE_TYPES;
const userService = new UserService();
const memeService = new MemeService();

export async function createCommand(user, msg, bot) {
    const chatId = msg.chat.id;

    try {
        await userService.updateUserState(user.id, MEME_SENDING);
    } catch (err) {
        console.error(err);
    }

    bot.sendMessage(
        chatId,
        'Send audio with title for your meme',
    );
}

export async function createMemeCommand(user, msg, bot) {
    const chatId = msg.chat.id;
    const audioFileId = msg.audio.file_id;

    if (user.state === MEME_SENDING && msg.caption) {
        const title = msg.caption;

        const isRecordWithSuchTiitleExist = await Meme.scope([ { method: [ 'title', title ] } ]).findOne();

        if (isRecordWithSuchTiitleExist) {
            bot.sendMessage(
                chatId,
                'You already have the meme with that name.\nPlease choose another name or cancel the current'
            );

            return;
        }

        // Meme object
        const newMeme = {
            fileId : audioFileId,
            title
        };

        // Saving meme
        try {
            await memeService.create({ ...newMeme, userId: user.id });

            bot.sendMessage(
                chatId,
                'Meme was created successfully!'
            );

            // Reset user status to NONE
            await userService.updateUserState(user.id, NONE);
        } catch (err) {
            console.error(err);
        }
    } else {
        bot.sendMessage(
            chatId,
            'You need to follow the correct order of creating a meme'
        );
    }
}
