import CartController from '../controllers/cart'
import { Request, Response, NextFunction } from "express";

export default class OrderController {
    static getCheckout = async (req: Request, res: Response, next: NextFunction) => {

        const orders = await req.user.getOrder();

        // orders = [orders[orders.length - 1]]

        res.render('shop/checkout', {
            pageTitle: 'Shop do Edian',
            path: '/checkout',
            orders: [orders.order],
            user: req.user
        });
    };

    static getOrders = (req: Request, res: Response, next: NextFunction) => {
        res.render('shop/orders', {
            pageTitle: 'Shop do Edian',
            path: '/orders'
        });
    };

    static postOrder = async (req: Request, res: Response, next: NextFunction) => {

        await req.user.addOrder();

        OrderController.getCheckout(req, res, next);
    };
}
