// --------------------------------------------------------------------------------------------------------------------
//
// main.js - test for the ofx package
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var tap = require("tap");
var test = tap.test;
var plan = tap.plan;
var ofx;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

test("load ofx", function (t) {
    ofx = require('../');
    t.ok(ofx, 'object loaded');
    t.equal(typeof ofx.parse, 'function', 'it is a function');
    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
