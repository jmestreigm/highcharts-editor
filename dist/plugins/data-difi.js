/*

Highcharts Editor v0.3.0

Copyright (c) 2016-2017, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.import.install('Difi', {
    description: 'Imports data from the Norwegian Agency for Public Management and eGovernment. <a href="http://difi.no" target="_blank">www.difi.no</a>',
    treatAs: 'csv',
    fetchAs: false,
    defaultURL: 'http://hotell.difi.no/api/json/fad/lonn/a-tabell',
    options: {
        includeFields: {
            type: 'string',
            label: 'Fields to include, separate by whitespace',
            default: 'trinn brutto-mnd'
        }
    },
    filter: function (data, options, fn) {
        var csv = [], header = [];

        try {
            data = JSON.parse(data);
        } catch (e) {
            fn(e);
        }

        options.includeFields = highed.arrToObj(options.includeFields.split(' '));

        if (highed.isArr(data.entries)) {

            //Only include things we're interested in
            data.entries = data.entries.map(function (d) {
                var r = {};
                Object.keys(options.includeFields).forEach(function (c) {
                    r[c] = d[c];
                });
                return r;
            });

            data.entries.forEach(function (row, i) {
                var rdata = [];                            
                
                Object.keys(row).forEach(function (key) {
                    var col = row[key];

                    if (!options.includeFields[key]) {
                        return;
                    }

                    if (i == 0) {
                        header.push(key);
                    }

                    //if (highed.isNum(col)) {
                        col = col.replace(',', '.');
                  //  }

                    rdata.push(col);
                    
                });
                csv.push(rdata.join(','));
            });
        }

        fn(false, [header.join(',')].concat(csv).join('\n'));
    }
}
);
