/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 13-3-15
 * Time: 下午11:04
 * To change this template use File | Settings | File Templates.
 */

//http://jordy.easymorse.com/?p=422


var fs = require('fs');
var FLog = require('../modules/log').create();
var exec = require('child_process').exec;


exports.parseExcel= function(filePath,callBack){
    var python="python "+__dirname+"/../public/excel.py "+filePath;
    FLog.info('python 命令: '+ python);
    var firstArray=[],secondArray=[];
    var doc={isSuccess:true,firstArray:firstArray,secondArray:secondArray};
    exec(python,function (error, stdout, stderr) {
        if (error || stderr) {
            doc.isSuccess=false;
            callBack(doc);
            FLog.error('exec error : ' + error);
            FLog.error('exec stderr : ' + stderr);
        }else{
            var xlsDataArray=stdout.split(/\r?\n/ig);
            xlsDataArray.splice(0,1);
            for(var i=0;i<xlsDataArray.length;i++){
                if(xlsDataArray[i]!=''){
                    var rowArray=xlsDataArray[i].split('|ysy|');
                    firstArray.push(rowArray[0]);
                    secondArray.push(rowArray[1]);
                }
            }
            compareDifferent(firstArray,secondArray,function(firstArray,secondArray){
                doc.firstArray=removeDuplicateInArray(firstArray);
                doc.secondArray=removeDuplicateInArray(secondArray);
                callBack(doc);
            });
        }
    });
};

function compareDifferent(firstArray,secondArray,callBack){
    var firstCompared=[],secondCompared=[];
    for(var i=0;i<firstArray.length;i++){
        if(!isExsitInArray(firstArray[i],secondArray)){
            firstCompared.push(firstArray[i]);
        }
    }
    for(var j=0;j<secondArray.length;j++){
        if(!isExsitInArray(secondArray[j],firstArray)){
            secondCompared.push(secondArray[j]);
        }
    }
    callBack(firstCompared,secondCompared);
}

function isExsitInArray(obj,array){
    for(var i=0;i<array.length;i++){
        if(obj==array[i]){
            return true;
        }
    }
    return false;
}

function removeDuplicateInArray(array){
    var tempArray=[];
    for(var i=0;i<array.length;i++){
        if(!isDuplicateInArray(array[i],tempArray)){
            tempArray.push(array[i]);
        }
    }
    return tempArray;
    function isDuplicateInArray(str,targetArray){
        for(var j=0;j<targetArray.length;j++){
            if(targetArray[j]==str){
                return true;
            }
        }
        return false;
    }
}

//exports.parseExcel(__dirname+"/../public/test.xlsx",function(doc){
//    FLog.info('parse result: ', doc);
//});