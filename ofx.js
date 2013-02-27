var xml2json = require('xml2json');

function parse(data) {
    // firstly, split into the header attributes and the footer sgml
    var ofx = data.split('<OFX>', 2);

    // firstly, parse the headers
    var headerString = ofx[0].split(/\r?\n/);
    var header = {};
    headerString.forEach(function(line, i) {
        var m;
        if ( m = line.match(/^(\w+):(.+)$/) ) {
            header[m[1]] = m[2];
        }

    });

    // make the SGML and the XML
    var sgml = '<OFX>' + ofx[1];
    var xml = sgml
        .replace(/>\s+</g, '><')
        .replace(/\s+</g, '<')
        .replace(/>\s+/g, '>')
        .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)/g, '<\$1\$2>\$3' )
        .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</\$1>');

    // parse the XML
    var data = JSON.parse(xml2json.toJson(xml));

    // loop through all of the statement transactions
    var transactions;
    var saveTransactions = [];
    if ( data.OFX
         && data.OFX.BANKMSGSRSV1
         && data.OFX.BANKMSGSRSV1.STMTTRNRS
         && data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS
         && data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST
         && data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN
       ) {
        transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
        transactions.forEach(function(t, i) {
            var date = '' + t.DTPOSTED;
            date = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);

            var transaction = {
                'amount' : Math.round(t.TRNAMT * 100),
                'date'   : new Date(date),
                'type'   : t.TRNTYPE,
                'fitid'  : '' + t.FITID, // sometimes these look like numbers, so turn them into a string
                'name'   : t.NAME,
                'memo'   : t.MEMO,
            };
            saveTransactions.push(transaction);
        });
    }

    // put the headers into the returned data
    data.header = header;
    data.transactions = saveTransactions;

    // save some other metadata
    data.meta = {};
    data.meta.accountId = '' + data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID;
    data.meta.bankId    = '' + data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.BANKID;
    data.meta.branchId  = '' + data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.BRANCHID;
    data.meta.accountType = '' + data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTTYPE;

    return data;
}

function serialize(header, body) {
    var out = '';
    // header order could matter
    var headers = ['OFXHEADER', 'DATA', 'VERSION', 'SECURITY', 'ENCODING', 'CHARSET',
        'COMPRESSION', 'OLDFILEUID', 'NEWFILEUID'];

    headers.forEach(function(name) {
        out += name + ':' + header[name] + '\n';
    });
    out += '\n';

    out += objToOfx({ OFX: body });
    return out;
}

var objToOfx = function(obj) {
  var out = '';

  Object.keys(obj).forEach(function(name) {
    var item = obj[name];
    var start = '<' + name + '>';
    var end = '</' + name + '>';

    if (item instanceof Object) {
        if (item instanceof Array) {
            item.forEach(function(it) {
                out += start + '\n' + objToOfx(it) + end + '\n';
            });
            return;
        }
        return out += start + '\n' + objToOfx(item) + end + '\n';
    }
    out += start + item + '\n';
  });

  return out;
}

module.exports.parse = parse;
module.exports.serialize = serialize;
