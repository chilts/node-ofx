# OFX #

Parse Open Financial Exchange (OFX) files into a usable data structure. Serialize objects into OFX file format.

## Install ##

```
$ npm install ofx
```

## Parsing ##

```js
const ofx = require('ofx');

fs.readFile('Account-1234-5678.ofx', 'utf8', function(err, ofxData) {
    if (err) throw err;

    const data = ofx.parse(ofxData);
    console.dir(data);
});
```

## Serializing ##

```js
const ofx = require('ofx');

const header = {
    OFXHEADER: '100',
    DATA: 'OFXSGML',
    VERSION: '103',
    SECURITY: 'NONE',
    ENCODING: 'USASCII',
    CHARSET: '1252',
    COMPRESSION: 'NONE',
    OLDFILEUID: 'NONE',
    NEWFILEUID: 'unique id here'
};

const body = {
    SIGNONMSGSRQV1: {
      SONRQ: {
        DTCLIENT: 'value',
        USERID: 'user id',
        USERPASS: 'password',
        LANGUAGE: 'ENG',
        FI: {
          ORG: 'org',
          FID: 'fid'
        },
        APPID: 'QWIN',
        APPVER: '2100',
        CLIENTUID: 'needed by some places'
      }
    }
};

const ofx_string = ofx.serialize(header, body);
console.log(ofx_string);
```

## Data ##

In your data returned, you will have the following properties:

* OFX - a dump of the XML parsing as a js object
* header - just the 'key:values' pairs from the top of the OFX file

## caveats ##

The OFX file format is yucky, horrible and just silly. This module helps parse
the ones I know about. And it doesn't do it in a nice way either. It may or may
not work for your own use - only by trying it will you find out.

If you discover a broken file, please submit an issue with the sample file.

This module takes the OFX format and does the following:

* splits off the initial set of metadata (the "Key:Value" lines)
* tries to mechnically turn the SGML into a valid XML format
* turns the XML into a JavaScript data structure

## Credits ##

Thanks to [Christian Sullivan](https://github.com/euforic) for writing
[banking.js](https://github.com/euforic/banking.js), upon which some of this code is based. Many thanks for letting me
use it.

## Author ##

```
$ npx chilts

   ╒════════════════════════════════════════════════════╕
   │                                                    │
   │   Andrew Chilton (Personal)                        │
   │   -------------------------                        │
   │                                                    │
   │          Email : andychilton@gmail.com             │
   │            Web : https://chilts.org                │
   │        Twitter : https://twitter.com/andychilton   │
   │         GitHub : https://github.com/chilts         │
   │         GitLab : https://gitlab.org/chilts         │
   │                                                    │
   │   Apps Attic Ltd (My Company)                      │
   │   ---------------------------                      │
   │                                                    │
   │          Email : chilts@appsattic.com              │
   │            Web : https://appsattic.com             │
   │        Twitter : https://twitter.com/AppsAttic     │
   │         GitLab : https://gitlab.com/appsattic      │
   │                                                    │
   │   Node.js / npm                                    │
   │   -------------                                    │
   │                                                    │
   │        Profile : https://www.npmjs.com/~chilts     │
   │           Card : $ npx chilts                      │
   │                                                    │
   ╘════════════════════════════════════════════════════╛
```

## License ##

The MIT License : http://appsattic.mit-license.org/2012/
