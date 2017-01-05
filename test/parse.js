// core
var fs = require('fs');
var test = require('tape');

// local
var ofx = require('..');

test('parse', function (t) {
    var file = fs.readFileSync(__dirname + '/data/example1.ofx', 'utf8');
    var data = ofx.parse(file);

    // headers
    t.equal(data.header.OFXHEADER, '100');
    t.equal(data.header.ENCODING, 'USASCII');

    var transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    t.equal(transactions.length, 5);

    var status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    t.equal(status.CODE, '0');
    t.equal(status.SEVERITY, 'INFO');

    t.end();
});

test('parse XML', function (t) {
    var file = fs.readFileSync(__dirname + '/data/example-xml.qfx', 'utf8');
    var data = ofx.parse(file);

    // headers
    t.equal(data.header.OFXHEADER, '100');
    t.equal(data.header.ENCODING, 'USASCII');

    var transaction = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    t.same(transaction, {
        TRNTYPE: 'INT',
        DTPOSTED: '20161215000550',
        TRNAMT: '0.84',
        FITID: '21172131531687',
        NAME: 'Interest Paid'
    });

    var status = data.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    t.equal(status.CODE, '0');
    t.equal(status.SEVERITY, 'INFO');

    t.end();
})

// parse <-> serialize
test('serialize', function(t) {
    var expected = fs.readFileSync(__dirname + '/data/example1.ofx', 'utf8');
    var data = ofx.parse(expected);

    var actual = ofx.serialize(data.header, data.OFX);
    t.equal(actual, expected);
    t.deepEqual(ofx.parse(actual), data);

    t.end();
});
