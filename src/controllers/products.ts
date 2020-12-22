import Product from '../models/product';
import { Request, Response, NextFunction } from "express";
import { ObjectId } from 'mongodb';

class ProductController {
    static getShop = (req: Request, res: Response, next: NextFunction) => {
        res.render('shop/', {
            pageTitle: 'Shop do Edian',
            path: '/shop'
        });
    };

    static getProduct = async (req: Request, res: Response, next: NextFunction) => {

        const prodId = new ObjectId(req.params.productId);

        const product = await Product.fetch(prodId);

        res.render('shop/product-detail', {
            pageTitle: product.title,
            path: '/products',
            product,
        });
    }

    static getAllProducts = async (req: Request, res: Response, next: NextFunction) => {

        const products = await Product.fetchAll();
        const productsCount = products.length;

        res.render('shop/product-list', {
            pageTitle: 'Shop do Edian',
            products,
            shopTitle: 'Shop Edian',
            path: '/products',
            productsCount
        });
    };

    static getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {

        const products = await Product.fetchAll();

        res.render('admin/products', {
            pageTitle: 'Shop do Edian - Admin',
            products,
            shopTitle: 'Shop Edian',
            path: '/admin/products'
        });
    };


    static getAddProduct = (req: Request, res: Response, next: NextFunction) => {
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false
        });
    };

    static postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
        const { title, imageUrl, price, description, category } = req.body

        const product = new Product(title, imageUrl, price, description, category);

        try {
            await product.save();
        } catch (error) {
            console.error(error);
        }
        res.redirect('/shop')
    }

    static getEditProduct = async (req: Request, res: Response, next: NextFunction) => {
        const editMode = req.query.edit;

        if (!editMode) {
            return res.redirect('/shop')
        }

        const prodId = new ObjectId(req.params.id);
        const product = await Product.fetch(prodId);

        if (!product) {
            return res.redirect('/shop')
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product
        });
    };

    static postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
        const { _id, title, imageUrl, price, description, category } = req.body;

        const product = new Product(title, imageUrl, price, description, category, _id);

        await product.save();
        res.redirect('/shop')
    };

    static deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        const id = new ObjectId(req.params.id);
        await Product.delete(id);
        res.redirect('/shop')
    };
}

export default ProductController;
