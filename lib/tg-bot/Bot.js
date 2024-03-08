import EventEmitter                         from 'node:events';
import TelegramBot                          from 'node-telegram-bot-api';
import config                               from '../config.cjs';
import User                                 from '../domain-model/User.js';
import { MemeService }                      from './services/MemeService.js';
import { UserService }                      from './services/UserService.js';
import { Commands }                         from './commands.js';
import { startCommand }                     from './bot-commands/start.js';
import { cancelCommand }                    from './bot-commands/cancel.js';
import { deleteCommand, deleteHandler }     from './bot-commands/delete.js';
import { createCommand, createMemeCommand } from './bot-commands/create.js';

const token = config['tg-token'];
const { MEME_DELETING, MEME_SENDING } = User.STATE_TYPES;

const memeService = new MemeService();
const userService = new UserService();

export class Bot {
    constructor(polling = process.env.MODE !== 'test') {
        this.bot = polling
            ? new TelegramBot(token, { polling })
            : new EventEmitter();

        if (!polling) this.bot.setMyCommands = () => {};

        // if (!polling) {
        //     this.bot.on('polling_error', (msg) => console.log(msg));
        //     this.bot.on('error', () => {});
        //     this.bot.stopPolling();
        // nock('https://api.telegram.org', {})
        //     .filteringPath((path) => {
        //         return '/';
        //     })
        //     .post('/transactions/draft/purchase/')
        //     .reply(200,  {});
        // }
    }

    static SERVICE_BY_TEXT = {
        '/start'  : startCommand,
        '/cancel' : cancelCommand,
        '/delete' : deleteCommand,
        '/create' : createCommand
    }

    init() {
        this.bot.setMyCommands(Commands);

        this.bot.on('callback_query', async (query) => {
            const data = query.data;
            const fromId = query.from.id;
            const { dataValues : user } = await userService.show(fromId);

            switch (data) {
                case 'create_meme':
                    createCommand(user, query.message, this.bot);
                    break;
                case 'delete_meme':
                    deleteCommand(user, query.message, this.bot);
                    break;
                default:
                    break;
            }
        });

        this.bot.on('audio', async (msg) => {
            const fromId = msg.from.id;

            // Get user from db
            try {
                const { dataValues : user } = await userService.show(fromId);

                await createMemeCommand(user, msg, this.bot);
            } catch (err) {
                console.error(err);
            }
        });

        this.bot.on('inline_query', async (inlineQuery) => {
            const inlineQueryId = inlineQuery.id;
            // Current inline query
            const searchQuery = inlineQuery.query.toLowerCase();
            const fromId = inlineQuery.from.id;
            const user = await userService.show(fromId);

            const memes = await memeService.showAll(user.id);

            const filteredMemes = memes.filter(meme => {
                // Comparing meme title with inline query
                return meme.title.toLowerCase().includes(searchQuery);
            });

            const formattedMemes = filteredMemes.map(meme => {
                return {
                    type             : 'document',
                    id               : meme.id,
                    title            : meme.title,
                    document_file_id : meme.fileId
                };
            });

            // answerInlineQuery usage for query reply
            this.bot.answerInlineQuery(inlineQueryId, formattedMemes, { cache_time: 0 });
        });

        this.bot.on('text', async (msg) => {
            const chatId = msg.chat.id;

            const allowedUsers = process.env.ACCESSES.split(',').map(id => parseInt(id.trim(), 10));

            if (allowedUsers.includes(chatId)) {
                this.handleTextMessage(msg);
            } else {
                this.bot.sendMessage(chatId, 'Sorry, you are not allowed to use this bot.');
            }
        });
    }

    async handleTextMessage(msg) {
        const chatId = msg.chat.id;
        const fromUsername = msg.from.username;
        const { dataValues: user } = await userService.findOrCreate(chatId, fromUsername);
        const cancelRegex = /\/cancel/;
        const { text : messageText } = msg;

        if (user.state === MEME_DELETING && !msg.text.match(cancelRegex)) {
            return deleteHandler(user, msg, this.bot);
        }

        if (user.state === MEME_SENDING && !msg.text.match(cancelRegex)) {
            this.bot.sendMessage(
                chatId,
                'Send an audio with title, please, or cancel the current operation.'
            );

            return;
        }

        if (Object.keys(Bot.SERVICE_BY_TEXT).includes(messageText)) {
            return Bot.SERVICE_BY_TEXT[messageText](user, msg, this.bot);
        }

        this.bot.sendMessage(
            chatId,
            'Not a proper command'
        );
    }
}
