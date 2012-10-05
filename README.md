```
 _______  _______          
(  ___  )(  ____ \|\     /|
| (   ) || (    \/( \   / )
| |   | || (__     \ (_) / 
| |   | ||  __)     ) _ (  
| |   | || (       / ( ) \ 
| (___) || )      ( /   \ )
(_______)|/       |/     \|
                           
```

Parse Open Financial Exchange (OFX) files into a usable data structure.

# OFX Files #

This file format is yucky, horrible and just silly. This module helps parse the ones I know about. And it doesn't do it
in a nice way either. It may or may not work for your own use - only by trying it will you find it. And good luck
trying.

But other than that ... please do try it and let me know how it goes. Only by trying a large selection of different
financial institutions OFX variations can we be sure that this module does what is expected (and not necessarily to the
letter of the law of the file format).

# Example #

```
var fmt = require('fmt');
var ofx = require('ofx');

fs.readFile('Account-1234-5678.ofx', 'utf8', function(err, ofxData) {
    if (err) throw err;

    var data = ofx.parse(ofxData);
    fmt.dump(data);
});
```

# Data #

In your data returned, you will have four keys: 'OFX', 'header', 'meta' and 'transactions'.

* OFX - a dump of the XML parsing
* header - just the 'key:values' pairs from the top of the OFX file
* meta - a bits of info extracted from deep-down for easy access
* transactions - a more sane list of the transactions

Warning: these may or may not be populated. Testing over a period of time has not yet been performed.

# Caveats #

This module takes the OFX format and does the following:

* splits off the initial set of metadata (the "Key:Value" lines)
* tries to mechnically turn the SGML into a valid XML format
* turns the XML into a JavaScript data structure
* tries to pull various things out of the data

It isn't very nice but it seems to work. Seriously, you shouldn't use this module! Unless you really need it and if you
do, please let me know if it doesn't work and send me an example of the format which doesn't. I'll add a test and we
can carry on all happy about the world. Thanks. :)

# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

The MIT License : http://appsattic.mit-license.org/2012/

(Ends)
