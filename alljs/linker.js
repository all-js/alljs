function len(code) {
    //code = code.split('\n');
    var res = 0;
    for(var i=0;i<code.length;i++) {
        var line = code[i];
        if(!(line==="")) {
            
            if(line[0]=='d') {
                res += 1;
            }
            else {
                var inst = line.split(' ')[0]
                res += instructions[inst].size;
            }
        }
    }
    return res;
}
function shift(code, offset) {
    //returns line list
    code = code.split('\n');
    newCode = [];
    for(var i=0; i< code.length; i++) {
        var line = code[i];
        if(!(line==="")) {
            //replace address
            var newLine = line.replace(reAddress, function(match, p) {
                return '*('+(parseInt(p)+offset)+')';
            });
            newCode.push(newLine);
        }
    }

    return newCode;

}
function link(objList) {
    //list of objs
    var pc = 0;
    var newCode = [];
    var globalSymbolTable = {};
    for(var i=0; i< objList.length; i++) {
        var obj = objList[i];
        var shiftedCode = shift(obj.code, pc);
        newCode.push.apply(newCode, shiftedCode);
        //add globals to global symbol table while shifting
        for(var j=0; j < obj.globals.length ; j++) {
            globalSymbolTable[obj.globals[j]] = obj.symbolTable[obj.globals[j]] + pc;
        }
        //increment pc
        pc = pc + len(shiftedCode);
        console.log(pc);

    }

    //construct new code
    var newString = "";
    for(var i=0; i < newCode.length; i++) {
        newString += newCode[i] + '\n';
    }

    //replace left over labels
    return passTwo(newString, globalSymbolTable);

}