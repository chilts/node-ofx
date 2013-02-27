var fs = require('fs');
var tap = require('tap');

var ofx = require('..');

var test = tap.test;
var plan = tap.plan;

test('parse', function (t) {
    var file = fs.readFileSync(__dirname + '/data/example1.ofx', 'utf8');
    var data = ofx.parse(file);

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

// parse <-> serialize
test('serialize', function(t) {
    var expected = fs.readFileSync(__dirname + '/data/example1.ofx', 'utf8');
    var data = ofx.parse(expected);

    var actual = ofx.serialize(data.header, data.OFX);
    t.equal(actual, expected);
    t.deepEqual(ofx.parse(actual), data);

    t.end();
});
