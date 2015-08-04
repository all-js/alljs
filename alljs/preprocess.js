function removeRedundantSpaces(line) {
    //split by whitespace
    var keys = line.split(/\s+/i);
    console.log(keys);
    var res = "";
    for(var i=0; i< keys.length; i++) {
        res += keys[i] + ' ';

    }
    console.log(res);
    res = res.trim();
    return res;
}

function preprocess(code) {
    //split into lines
    code = code.split('\n');
    //iterate over lines
    newCode = [];
    for(var i=0; i < code.length; i++) {
        var line = code[i].trim();
        //remove empty lines
        
        if(!(line==="")) {
        //labels
        
        if(mt = line.match(reLabel)) {
            //fill empty with nop
            if(mt[2].trim() === "") {
                newLine = mt[1] + ':' + ' NOP';
            }
            else {
                newLine = mt[1] + ':' + ' ' + mt[2];
            }
        }
        //otherwise
        else {
            newLine = line;
        }

        //remove redundant spaces
        newLine = removeRedundantSpaces(newLine);

        //convert to upper case
        newLine = newLine.toUpperCase();

        //push newline
        newCode.push(newLine);
    }
    }

    var newString = "";
    for(var i=0; i < newCode.length; i++) {
        newString += newCode[i] + '\n';
    }

    //return
    return newString;

}