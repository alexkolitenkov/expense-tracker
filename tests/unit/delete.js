import { Bot }         from '../../lib/tg-bot/Bot.js';
import User            from '../../lib/domain-model/User.js';
import Meme            from '../../lib/domain-model/Meme.js';
import { MemeService } from '../../lib/tg-bot/services/MemeService.js';

const { MEME_DELETING, NONE } = User.STATE_TYPES;
const memeService = new MemeService();

export default [
    {
        label  : 'Positive: Correctly change the user\'s state during the deletion of a meme. Verifying whether a meme was created previously and then deleted afterward.',
        before : async () => {
            const msg = {
                chat : {
                    id : 1234
                },
                from : {
                    username : 'alexkltv',
                    id       : 1234
                },
                text : '/delete'
            };
            const secondMessage = {
                chat : {
                    id : 1234
                },
                from : {
                    username : 'alexkltv',
                    id       : 1234
                },
                text : 'another'
            };
            const mockMemeInDB = {
                chat : {
                    id : 1234
                },
                audio : {
                    file_id : 'CQACAgIAAxkBAAIJwGWqrv_STaZztbj1O6C5p1wy8eKpAAJHQAAC7RpYSWHmd0PzNV6INAQ'
                },
                caption : 'another'
            };
            const myBot = new Bot();

            myBot.init();
            myBot.bot.sendMessage = () => {};

            await myBot.handleTextMessage(msg);

            const user = await User.scope([ { method: [ 'id', msg.chat.id ] } ]).findOne();

            await memeService.create({  fileId : mockMemeInDB.audio.file_id,
                title  : mockMemeInDB.caption,
                userId : mockMemeInDB.chat.id });

            return { msg, myBot, secondMessage, user };
        },
        test : async ({ t, myBot, secondMessage, user }) => {
            t.is(user.state, MEME_DELETING);

            const memeBeforeDelete = await Meme.scope([ { method: [ 'title', secondMessage.text ] } ]).findOne();

            t.truthy(memeBeforeDelete);
            await myBot.handleTextMessage(secondMessage);
            await user.reload();
            t.is(user.state, NONE);

            const noMemeAfterDelete = await Meme.scope([ { method: [ 'title', secondMessage.text ] } ]).findOne();

            t.falsy(noMemeAfterDelete);
        }
    }
];
