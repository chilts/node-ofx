var xml2json = require('xml2json');

function sgml2Xml(sgml) {
    return sgml
        .replace(/>\s+</g, '><')    // remove whitespace inbetween tag close/open
        .replace(/\s+</g, '<')      // remove whitespace before a close tag
        .replace(/>\s+/g, '>')      // remove whitespace after a close tag
        .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)/g, '<\$1\$2>\$3' )
        .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</\$1>');
}

function parseXml(content) {
    return JSON.parse(xml2json.toJson(content, { coerce: false }))
}

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
    var content = '<OFX>' + ofx[1];

    // Parse the XML/SGML portion of the file into an object
    // Try as XML first, and if that fails do the SGML->XML mangling
    var data = null;
    try {
        data = parseXml(content);
    } catch (e) {
        data = parseXml(sgml2Xml(content));
    }

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
