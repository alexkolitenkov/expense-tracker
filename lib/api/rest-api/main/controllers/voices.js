import chista     from '../../chista.js';
import { Create } from '../../../../use-cases/main/voices/Create.js';
import { List }   from '../../../../use-cases/main/voices/List.js';
import { Show }   from '../../../../use-cases/main/voices/Show.js';
import { Update } from '../../../../use-cases/main/voices/Update.js';
import { Delete } from '../../../../use-cases/main/voices/Delete.js';

export default {
    create : chista.makeUseCaseRunner(Create, req => req.body),
    list   : chista.makeUseCaseRunner(List,   req => req.query),
    show   : chista.makeUseCaseRunner(Show,   req => req.params),
    update : chista.makeUseCaseRunner(Update, req => ({ ...req.body, ...req.params })),
    delete : chista.makeUseCaseRunner(Delete, req => req.params)

};
