// --------------------------------------------------------------------------------------------------------------------
//
// parse.js - test for the ofx parsing
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var fs = require('fs');
var tap = require("tap");

var ofx = require('..');

var test = tap.test;
var plan = tap.plan;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

test("load file", function (t) {
    var file = fs.readFileSync('data/example1.ofx', 'utf8');
    var data = ofx.parse(file);
    console.log(data);

    // headers
    t.equal(data.header.OFXHEADER, '100', 'ofxheader');
    t.equal(data.header.ENCODING, 'USASCII', 'encoding');

    // meta
    t.equal(data.meta.accountId, '1234567-00', 'account id');
    t.equal(data.meta.bankId, '1', 'bank id');
    t.equal(data.meta.branchId, '123', 'branch id');
    t.equal(data.meta.accountType, 'SAVINGS', 'account type');

    // transactions
    t.equal(typeof data.transactions, 'object', 'transactions loaded');
    t.equal(data.transactions.length, 5, 'five transactions');

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
