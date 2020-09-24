var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var parse = require('pg-connection-string').parse;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes/index');
var definitions = require('./routes/definition');
var app = express();

const port = process.env.PORT || 8080;
const massive = require('massive');

var connectionString = process.env.DATABASE_URL

if (connectionString==undefined) {
    // Fallback to a local Postgres
    connector=parse("postgres://postgres@localhost/postgres");
    connector.ssl=false;
} else {
    connector=parse(connectionString);
    connector.ssl={ "sslmode": "require", "rejectUnauthorized":false };
}

(async () => {
    try {
        const db = await massive(connector);
        app.set('db', db);
        tables=db.listTables()
    } catch (e) {
        console.log("No DB",e)
        // Deal with the fact the chain failed
    }
})();


// Handlebars view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/definitions', definitions);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(port, () => console.log(`Flydictionary app listening on ${port}`));