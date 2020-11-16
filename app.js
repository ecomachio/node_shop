const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./utils/path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const exceptionsController = require('./controllers/exceptions');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'templates')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use('/shop', shopRoutes)

app.use(exceptionsController.pageNotFound)

app.listen(3000)