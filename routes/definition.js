
var express = require('express');
var definitions = express.Router();
var app = express();

// Find products
definitions.get('/', async function (req, res, next) {
  definitions = await req.app.get("db").definitions
  if (definitions==undefined) {
    res.render('definitions', {
      tab: 'definitions',
      title: 'Find Definitions'});
      return;
  }

  if (!req.query.q) {
    definitions = await req.app.get("db").definitions.findDoc({});
    res.render('definitions', {
      tab: 'definitions',
      title: 'Find Definitions',
      definitions: definitions
    });
  } else {
    definitions = await req.app.get('db').definitions.findDoc({
      'word ilike': `%${req.query.q}%`
    })

    res.render('definitions', {
      tab: 'definitions',
      title: 'Find Definitions',
      q: req.query.q,
      definitions: definitions
    });
  }
});

// Render new product page
definitions.get('/new', function (req, res, next) {
  res.render('definition', {
    tab: 'definition',
    title: 'New Word',
  });
});

// Create a new product
definitions.post('/new', function (req, res, next) {
  try {
    const result=req.app.get('db').saveDoc("definitions", req.body);
    res.redirect("/definitions/");
   } catch (err) {
      console.log(err);
      res.sendStatus(500);
  }
});

module.exports = definitions;
