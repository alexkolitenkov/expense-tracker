export function inlineKeyboard(bot, chatId) {
    bot.sendMessage(
        chatId,
        'Hello! This bot can store audio memes and you can use them in different chats via @.\nTo create a meme you can use button from inline keyboard.\nOr you can simply type /start and follow further instructions.',
        {
            reply_markup : {
                resize_keyboard : true,
                inline_keyboard : [
                    [ { text: 'Delete specified meme', callback_data: 'delete_meme' } ],
                    [ { text: 'Create a meme', callback_data: 'create_meme' } ]
                ]
            }
        }
    );
}
