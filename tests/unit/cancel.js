import { Bot } from '../../lib/tg-bot/Bot.js';
import User    from '../../lib/domain-model/User.js';

const { NONE, MEME_DELETING, MEME_SENDING } = User.STATE_TYPES;

export default [
    {
        label  : 'Positive: /cancel resetting user state to NONE when deleting',
        before : async () => {
            const msg = {
                chat : {
                    id : 1234
                },
                from : {
                    username : 'alexkltv',
                    id       : 1234
                },
                text : '/cancel'
            };
            const myBot = new Bot();

            myBot.bot.sendMessage = () => {};

            myBot.init();
            await myBot.handleTextMessage(msg);
            const user = await User.scope([ { method: [ 'id', msg.chat.id ] } ]).findOne();

            return { msg, myBot, user };
        },
        test : async ({ t, msg, myBot, user }) => {
            await User.scope([ { method: [ 'id', msg.chat.id ] } ]).update({ state: MEME_DELETING });
            await user.reload();

            await myBot.handleTextMessage(msg);
            await user.reload();

            t.truthy(user.state === NONE);
        }
    },
    {
        label  : 'Positive: /cancel resetting user state to NONE when creating',
        before : async () => {
            const msg = {
                chat : {
                    id : 1234
                },
                from : {
                    username : 'alexkltv',
                    id       : 1234
                },
                text : '/cancel'
            };
            const myBot = new Bot();

            myBot.bot.sendMessage = () => {};

            myBot.init();
            await myBot.handleTextMessage(msg);
            const user = await User.scope([ { method: [ 'id', msg.chat.id ] } ]).findOne();

            return { msg, myBot, user };
        },
        test : async ({ t, msg, myBot, user }) => {
            await User.scope([ { method: [ 'id', msg.chat.id ] } ]).update({ state: MEME_SENDING });
            await user.reload();

            await myBot.handleTextMessage(msg);
            await user.reload();

            t.truthy(user.state === NONE);
        }
    }
];
