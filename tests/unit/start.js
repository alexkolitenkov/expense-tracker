import { Bot } from '../../lib/tg-bot/Bot.js';
import User    from '../../lib/domain-model/User.js';

export default [
    {
        label  : 'Posititve: /start command creates user in DB and then retrieves it',
        before : async () => {
            const msg = {
                chat : {
                    id : 1234
                },
                from : {
                    username : 'alexkltv'
                },
                text : '/start'
            };
            const myBot = new Bot();

            myBot.init();
            myBot.bot.sendMessage = () => { };

            await myBot.handleTextMessage(msg);
            const user = await User.scope([ { method: [ 'id', msg.chat.id ] } ]).findOne();

            return { msg, myBot, user };
        },
        test : async ({ t, user }) => {
            t.truthy(user);
        }
    }
];
