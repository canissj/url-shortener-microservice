'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({"extended": false}));

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI);
const shortUrlSchema = new mongoose.Schema({
    "url": String,
    "short_url": String
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

const createShortUrl = (model, done) => {
  let shortUrl = new ShortUrl({
    url: model.url,
    short_url: model.short_url
  });
  
  shortUrl.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const getShortUrl = (done) => {
  ShortUrl.countDocuments({}, (err, count) => {
    if (err) return done(err);
    done(null, count);
  });
}

const findOriginalUrl = (shortUrl, done) => {
  ShortUrl.findOne({ "short_url": shortUrl }, (err, model) => {
    if (err) return done(err);
    done(null, model);
  });
}

/** middlewares **/
const validateBody = (req, res, next) => {
  let url = req.body.url;
  if (!url || !(url.startsWith("https://") || url.startsWith("http://"))) return res.json({"error":"invalid URL"});
  
  let dnsUrl = url.split("//")[1] // remove "htttp(s)//" because dns lookup do not support it
  dns.lookup(dnsUrl, (err) => {
    if (err) return res.json({"error":"invalid URL"});
    next();
  });
};

/** endpoints **/
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", validateBody, (req, res) => {
  
  getShortUrl((err, shortUrl) => {
    if (err) return res.json({"error": err});
    
    let model = { url: req.body.url, short_url: shortUrl };
    
    createShortUrl(model, (err, data) => {
      if (err) return res.json({"error": err});
      return res.json({"original_url": data.url, "short_url": data.short_url});
    });
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  findOriginalUrl(req.params.short_url, (err, model) => {
    if (err) return res.json({"err": err});
    res.redirect(model.url);
  });
});
  
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

