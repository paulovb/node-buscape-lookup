/**
 * Module dependencies
 */
var request = require('request')
  , _ = require('underscore');

// Endpoint template
var endpoint = _.template('http://<%=service%>/service/<%=method%>/lomadee/<%=id%>/<%=country%>/');

var Buscape = function Buscape(opts) {
  // Use production by default
  this._service = 'bws.buscape.com';

  if (opts.keywords) {
    this._keywords = opts;
    this.mode = 'search';
  }
};

// Set application id
Buscape.prototype.id = function (id) {
  return this._id = id, this;
};

// Set price range
Buscape.prototype.price = function (price) {
  // Allow min..max style pricerange
  price = ('string' === typeof price) ? price.split('..') : price;

  if (price[0]) this._minPrice = price[0];
  if (price[1]) this._maxPrice = price[0];

  return this;
};

// Set search country
Buscape.prototype.country = function (country) {
  return this._country = country, this;
};

// Enable or disable test mode (make calls to the sanbox, rather than primary)
Buscape.prototype.test = function (test) {
  // Default test to true
  test = (arguments.length === 0 ? true : !!test)
  return this._service = test ? 'sandbox.buscape.com' : 'bws.buscape.com'; 
};

Buscape.prototype.limit = function (limit) {
  // Don't accept falsy or 0 limits
  if (!limit) return this;
  return this._limit = limit, this;
};

Buscape.prototype.one = function (one) {
  // Default one to true
  one = (arguments.length === 0 ? true : !!one)
  return this._one = one, true;
};

Buscape.prototype.done = function (cb) {
  request
    .get(endpoint({
      service: this._endpoint,
      method: 'findProductList',
      id: this._id,
      country: this._country || 'BR'
    }))
    .query({keyword: this._keywords})
    .query({priceMin: this._minPrice})
    .query({priceMax: this._priceMax})
    .query({format: 'json'})
    .end(function (err, res) {
      if (err) return cb(err);
      return cb(null, res.text);
    });
};
