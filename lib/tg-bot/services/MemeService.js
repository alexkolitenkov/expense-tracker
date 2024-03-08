import Meme from '../../domain-model/Meme.js';

export class MemeService {
    async create(data) {
        const newMeme = await Meme.create(data);

        return newMeme;
    }

    async showAll(userId) {
        const allMemes = await Meme.scope([ { method: [ 'userId', userId ] } ]).findAll();

        return allMemes;
    }

    async showMeme(id) {
        const meme = await Meme.scope([ { method: [ 'id', id ] } ]).findOne();

        return meme;
    }

    async deleteMeme(memeTitle) {
        await Meme.scope({ method: [ 'title', memeTitle ] }).destroy();
    }
}
