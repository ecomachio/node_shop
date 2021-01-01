import path from 'path';
import http from 'http';

import express from 'express';
import bodyParser from 'body-parser';

import rootDir from './utils/path'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import { Router as orderRoutes } from './routes/order'
import pageNotFound from './controllers/exceptions';
import User from './models/user';

import { mongoConnect } from './utils/database';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'templates')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
    const u = await User.fetch("5fdd4bd3e1dd1409483cef06");
    req.user = new User(u.name, u.email, u.cart, u._id);

    next();
})

app.use('/admin', adminRoutes)
app.use('/shop', shopRoutes)
app.use('/order', orderRoutes)

app.use(pageNotFound)

mongoConnect("mongodb+srv://nodeshopdb:admin@cluster0.rweci.mongodb.net/nodeshopdb?retryWrites=true&w=majority").then(() => {
    app.listen(3000);
});
