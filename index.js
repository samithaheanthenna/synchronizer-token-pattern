'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

const app = express();
const PORT = 8090;
let SESSION_STORE = {};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(nocache());
app.use(express.static('static'));

app.listen(PORT, function () {
    console.log("Server is listening on " + PORT);
});


app.get('/', function (req, res) {

    const sessionId = req.cookies['node-session'];

    if (sessionId && SESSION_STORE[sessionId]) {
        res.sendFile('static/home.html', {root: __dirname});
    } else {
        res.sendFile('static/login.html', {root: __dirname});
    }

});

app.post('/home', function (req, res) {

    if (req.body.username === 'admin' && req.body.password === 'admin') {

        let session = uuidv1();
        let _csrf = uuidv4();
        SESSION_STORE[session] = _csrf;
        res.setHeader('Set-Cookie', [`node-session=${session}`] );
        res.sendFile('static/home.html', {root: __dirname});

    } else {
        res.sendFile('static/login.html', {root: __dirname});
    }

});

app.get('/home', function (req, res) {

    if (req.cookies['node-session'] && SESSION_STORE[req.cookies['node-session']]) {
        res.sendFile('static/home.html', {root: __dirname});
    } else {
        res.sendFile('static/login.html', {root: __dirname});
    }

});

app.get('/tokens', function (req, res) {

    const sessionId = req.cookies['node-session'];

    if (SESSION_STORE[sessionId]) {
        res.json({token: SESSION_STORE[sessionId]})
    } else {
        res.status(400).end();
    }

});

app.post('/comments', function (req, res) {

    const _csrf = req.body._csrf;
    const sessionId = req.cookies['node-session'];

    if (SESSION_STORE[sessionId] && SESSION_STORE[sessionId] === _csrf) {
        res.redirect('/home.html?status=success');
    } else {
        res.redirect('/home.html?status=failed');
    }

});

app.post('/logout', function (req, res) {

    const sessionId = req.cookies['node-session'];
    delete SESSION_STORE[sessionId];
    res.clearCookie('node-session');
    res.sendFile('static/login.html', {root: __dirname});

});