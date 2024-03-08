import express from 'express';
// import middlewares from '../middlewares.js';
import controllers from './controllers/index.js';

const router = express.Router();
// const { sequelizeSession, detectDevice, detectIp } = middlewares;

export default function init() {
    // router.use(sequelizeSession({ sequelize }));

    router.post('/memes', controllers.voices.create); // { name, description}
    router.get('/memes', controllers.voices.list);
    router.get('/memes/:id', controllers.voices.show); // /memes/412412?name=fdsf
    router.patch('/memes/:id', controllers.voices.update); // /memes/412412?name=fdsf
    router.delete('/memes/:id', controllers.voices.delete); // /memes/412412?name=fdsf
    router.get('/ping', (req, res) => {
        res.send('pong');
    });

    return router;
}

