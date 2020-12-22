import { Request, Response, NextFunction } from "express";

const pageNotFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).render('404', { pageTitle: 'Errrrou'})
}

export default pageNotFound

