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

highed.plugins.import.install('Socrata',  {
    description: 'Socrata is an open data format commonly used for various government sources. <a href="http://www.opendatanetwork.com/" target="_blank">http://www.opendatanetwork.com/</a>',
    treatAs: 'csv',
    fetchAs: 'json',
    defaultURL: 'https://finances.worldbank.org/resource/czdd-amke.json?$order=fiscal_year ASC&$where=vpu_group_code=\'REG\'',
    options: {
        includeFields: {
            type: 'string',
            label: 'Fields to include, separate by whitespace',
            default: 'fiscal_year amount_us_millions_'                        
        }
    },
    filter: function (data, options, fn) {
        var csv = [], header = [];

        options.includeFields = highed.arrToObj(options.includeFields.split(' '));

        if (highed.isArr(data)) {

            //Only include things we're interested in
            data = data.map(function (d) {
                var r = {};
                Object.keys(options.includeFields).forEach(function (c) {
                    r[c] = d[c];
                });
                return r;
            });

            data.forEach(function (row, i) {
                var rdata = [];                            
                
                Object.keys(row).forEach(function (key) {
                    var col = row[key];

                    if (!options.includeFields[key]) {
                        return;
                    }

                    if (i == 0) {
                        header.push(key);
                    }

                    rdata.push(parseInt(col) || col);
                    
                });
                csv.push(rdata.join(','));
            });
        }

        fn(false, [header.join(',')].concat(csv).join('\n'));
    }
});
