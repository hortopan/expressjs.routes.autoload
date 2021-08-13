import { Request, Response, Router } from 'express';

export default function (router: Router): Router {

    router.get('/typescript', (_req: Request, res: Response) => {
        res.send('typescript');
    });

    return router;
}
