/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 13-3-15
 * Time: 下午11:20
 * To change this template use File | Settings | File Templates.
 */

var xlrd = require('xlrd');
var FLog = require('../modules/log').create();

xlrd.parse('myfile.xlsx', function (err, workbook) {
    // Iterate on sheets
    workbook.sheets.forEach(function (sheet) {
        console.log('sheet: ' + sheet.name);
        // Iterate on rows
        sheet.rows.forEach(function (row) {
            // Iterate on cells
            row.forEach(function (cell) {
                console.log(cell.address + ': ' + cell.value);
            });
        });
    });
});