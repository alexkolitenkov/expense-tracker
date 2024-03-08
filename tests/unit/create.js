import { Bot } from '../../lib/tg-bot/Bot.js';
import User    from '../../lib/domain-model/User.js';
import Meme    from '../../lib/domain-model/Meme.js';

const { MEME_SENDING, NONE } = User.STATE_TYPES;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default [
    {
        label  : 'Positive: Correctly change the user\'s state during the creation of a meme. Verifying whether a meme was created successfully',
        before : async () => {
            const simulatedMessage = {
                from : {
                    id       : 1234,
                    username : 'alexkltv'
                },
                chat : {
                    id : 1234
                },
                audio : {
                    duration       : 11,
                    file_name      : 'wowowowowowowow-103214.mp3',
                    mime_type      : 'audio/mpeg',
                    file_id        : 'CQACAgIAAxkBAAIJwGWqrv_STaZztbj1O6C5p1wy8eKpAAJHQAAC7RpYSWHmd0PzNV6INAQ',
                    file_unique_id : 'AgADR0AAAu0aWEk',
                    file_size      : 235680
                },
                caption : 'another'

            };
            const msg = {
                chat : {
                    id : 1234
                },
                from : {
                    username : 'alexkltv',
                    id       : 1234
                },
                text : '/create'
            };
            const myBot = new Bot();

            myBot.init();
            myBot.bot.sendMessage = () => {};

            await myBot.handleTextMessage(msg);
            const user = await User.scope([ { method: [ 'id', msg.chat.id ] } ]).findOne();

            return { msg, myBot, simulatedMessage, user };
        },
        test : async ({ t, myBot, simulatedMessage, user }) => {
            t.is(user.state, MEME_SENDING);
            myBot.bot.emit('audio', simulatedMessage);
            await sleep(1000);
            await user.reload();
            t.is(user.state, NONE);

            const meme = await Meme.scope([ { method: [ 'fileId', simulatedMessage.audio.file_id ] } ]).findOne();

            t.truthy(meme);
        }
    }
];
