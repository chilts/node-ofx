var xml2json = require('xml2json');

function parse(data) {
    // firstly, split into the header attributes and the footer sgml
    var ofx = data.split('<OFX>', 2);

    // firstly, parse the headers
    var headerString = ofx[0].split(/\r?\n/);
    var header = {};
    headerString.forEach(function(attrs) {
        var headAttr = attrs.split(/:/,2);
        header[headAttr[0]] = headAttr[1];
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
    var data = JSON.parse(xml2json.toJson(xml, { coerce: false }));

    // put the headers into the returned data
    data.header = header;

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
