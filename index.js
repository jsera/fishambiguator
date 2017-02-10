var express = require("express");
var app = express();
var passport = require("passport");
// load config for environment
var app_config = require("./config/"+process.env.BUILD_ENV+"-config");
app.use(function(req, res, next) {
    res.locals.APP_CONFIG = app_config;
    next();
});

// Use EJS layoyuts
var ejsLayouts = require("express-ejs-layouts");
app.use(ejsLayouts);
app.set("view engine", "ejs");

// body parser for parsing urlencoded forms
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sessions
var session = require("express-session");
app.use(session({
  secret: 'oojfdjoie2qjfqek462dakjkjdsyu225wyie655qiue',
  resave: false,
  saveUninitialized: true
}));

//OAuth
var passport = require("passport");
var strategies = require("./config/strategies");
passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

var facebookStrategy = strategies.facebookStrategy;
passport.use(facebookStrategy);
app.use(passport.initialize());
app.use(passport.session());

// View helpers
var helpers = require("./helpers/");
app.use(helpers({
    staticImagePath: process.env.STATIC_SERVER
}));

// Stick the user in locals
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// Always give the constants to the templates
var constants = require("./constants");
app.use(function(req, res, next) {
    res.locals.constants = constants;
    next();
});

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.use("/auth", require("./controllers/auth"));
app.use("/fish", require("./controllers/fish"));
app.use("/genus", require("./controllers/genus"));
app.use("/pair", require("./controllers/pair"));
app.use("/api/fish", require("./controllers/apiFish"));
app.use("/api/genus", require("./controllers/apiGenus"));
app.use("/api/pictures", require("./controllers/apiPictures"));
app.use("/api/pair", require("./controllers/apiPair"));

// custom 404
app.use(function(req, res, next) {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url, layout: "error_layout" });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

app.listen(process.env.PORT || 3000);