#coding=UTF-8
#import types
import xlrd
import sys

#excel表格文件名
filename = sys.argv[1]
excel = xlrd.open_workbook(filename)

#得到第一张表单    根据索引
print excel.nsheets
sheet = excel.sheet_by_index(0)

def isNum(value):
    try:
        value + 1
    except TypeError:
        return False
    else:
        return True

for nrows in range(sheet.nrows):
    first = sheet.cell(nrows, 0).value
    if isNum(first):
        first = str(first)
    second = sheet.cell(nrows, 1).value
    if isNum(second):
        second = str(second)
    info = first + '|ysy|' + second
    print info.encode('utf8')