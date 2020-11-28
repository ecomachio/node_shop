const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./utils/path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const exceptionsController = require('./controllers/exceptions');

const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/User');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'templates')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
    req.user = await User.findByPk(1);
    console.log(req.user);
    next();
})

app.use('/admin', adminRoutes)
app.use('/shop', shopRoutes)

app.use(exceptionsController.pageNotFound)

Product.belongsTo(User);
User.hasMany(Product)

User.hasOne(Cart);
Cart.hasMany(CartItem);

Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

sequelize.sync(
    //    { force: true }
)
    .then(() => User.findByPk(1))
    .then(user => {
        if (!user) {
            User.create({
                name: 'Edian', email: 'ediancomachio@hotmail.com'
            });
        } else {
            return user;
        }
    }).then((user) => {
        user.createCart();
    })
    .then(() => app.listen(3000))
    .catch(err => console.error(err));
