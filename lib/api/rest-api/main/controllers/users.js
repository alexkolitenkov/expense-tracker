import chista            from '../../chista.js';
import { Registration }  from '../../../../use-cases/main/users/Registration.js';
import { sessionRender } from '../../sessionRender.mjs';

export default {
    register : chista.makeUseCaseRunner(Registration, req => ({
        ...req.body,
        useragent : { ...req.useragent, ip: req.clientIp }
    }), undefined, undefined, sessionRender),
    check : chista.makeUseCaseRunner(Registration, req => {
        console.log(req.session.context);

        return {};
    })
};
