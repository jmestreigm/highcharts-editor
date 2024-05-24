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

highed.plugins.export.install('beautify-json', {
    title: 'Beautified JSON',
    description: 'Exports well-formatted JSON',
    dependencies: [
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/theme/neo.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/javascript/javascript.min.js' 
    ], 
    //Set this to true to trigger a download when doing the export.
    //Useful for cases where the export is completely clientside.
    downloadOutput: true,
    //Set the title of the export button - default is "Export".
    exportTitle: 'Download',   

    //Called when creating the plugin
    create: function (chart, node) {
        this.textarea = highed.dom.cr('textarea');
        highed.dom.ap(node, this.textarea);

        this.cm = CodeMirror.fromTextArea(this.textarea, {
            lineNumbers: true,
            mode: 'javascript',
            readOnly: true,
            theme: 'neo'
        });

        this.update = function (chart) {
            var json = chart.export.json();

            if (json.chart && json.chart.renderTo) {
                delete json.chart.renderTo;
            }

            this.cm.setValue(JSON.stringify(json, undefined, '    '));
            this.cm.refresh();
            this.cm.focus();
        };

        this.update.call(this, chart);
    },                  
    //Called when showing the UI. Also called when the options change.
    show: function (chart) {
        this.update.call(this, chart);
    },
    //Called when triggering an export
    export: function (options, chart, fn) {
        fn(false, this.cm.getValue(), 'chart.json');
    }
});
