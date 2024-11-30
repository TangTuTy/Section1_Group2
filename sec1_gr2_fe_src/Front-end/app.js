const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const { clear } = require('console');
const port=3000

const app = express();
const router = express.Router();
const routeAd = express.Router();

app.use(express.static(path.join(`${__dirname}/css`)));
app.use(express.static(path.join(`${__dirname}/js`)));
app.use(express.static(path.join(`${__dirname}/member`)));
app.use(express.static(path.join(`${__dirname}/public-pic`)));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

app.use(router);
app.use("/admin", routeAd);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function Auth(req, res, next) {
    const Cookie = req.cookies['CookieNaJa'];
    console.log(Cookie);
    if (Cookie) {
        console.log("Cookie found:", Cookie);
        next();
    } else {
        console.log("No cookie found. Access denied.");
        res.redirect('/');
    }
}

router.get('/', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/login.html`))
})

router.post('/home', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/home.html`));
})
router.get('/home', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/home.html`));
})

router.get('/regis', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/regis.html`));
})

router.get('/home-login', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/home.html`));
})

router.get('/product', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/product.html`))
})

router.get('/products', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/products.html`))
})

router.get('/OurTeam', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/OurTeam.html`))
})

router.get('/Search', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/Search.html`))
})

// admin routes

routeAd.get('/home',Auth, (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/admin-home.html`))
})

routeAd.get('/acc',Auth, (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/admin-acc.html`))
})

routeAd.get('/pro',Auth, (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/admin-pro.html`))
})

routeAd.get('/all-acc',Auth, (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/admin-AllAcc.html`))
})

routeAd.get('/all-pro',Auth, (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/admin-AllPro.html`))
})

app.use((req, res, next) => {
    console.log("Request at " + req.url)
    console.log("404: Invalid accessed");
    res.status(404).sendFile(path.join(`${__dirname}/html/404.html`))
})

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})