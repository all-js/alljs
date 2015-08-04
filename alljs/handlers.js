// For Main code

//global objects
var objOne, objTwo, objThree;
var linkedCode;


$("#twoclr").click(function() {
    $("#highlightclr").text("");
})

$("#threeclr").click(function(){
    $("#highlightclr").text("");
})
// one
$("#preprocessone").click(function() {
  //preprocess
    var code = $('#highlight1').val();
    $('#highlight1').val(preprocess(code));
});

$("#pass1one").click(function() {
    //passone
    var code = $('#highlight1').val();
    var obj = passOne(code);
    objOne = obj;
    $('#symboltable1').html('');
    $('#definedsymbolsone').html('');
    $('#notdefinedsymbolsone').html('');
    for(key in obj.symbolTable) {
        $('#symboltable1').html($('#symboltable1').html() + '<b>' +key + '</b>' + '     ' + obj.symbolTable[key]+'<br>');
    }
    for(key in obj.globals) {
        $('#definedsymbolsone').html($('#definedsymbolsone').html() + '<b>' +key + '</b>' + '     ' + obj.globals[key]+'<br>');
    }
    for(key in obj.externals) {
        $('#notdefinedsymbolsone').html($('#notdefinedsymbolsone').html() + '<b>' +key + '</b>' + '     ' + obj.externals[key]+'<br>');
    }
    });

$("#pass2one").click(function() {
     //preprocess
    var code = $('#highlight1').val();
    code = passTwo(code, objOne.symbolTable);

    $('#highlight1').val(code);
    code = passTwo(code, objOne.symbolTable);
     $('#highlight1').val(code);

});

// For code two
$("#preprocesstwo").click(function() {
    var code = $('#highlight2').val();
    $('#highlight2').val(preprocess(code));
});

$("#pass1two").click(function() {
    var code = $('#highlight2').val();
    var obj = passOne(code);
    objTwo = obj;
    $('#symboltable2').html('');
    $('#definedsymbolstwo').html('');
    $('#notdefinedsymbolstwo').html('');
    for(key in obj.symbolTable) {
        $('#symboltable2').html($('#symboltable2').html() + '<b>' +key + '</b>' + '     ' + obj.symbolTable[key]+'<br>');
    }
    for(key in obj.globals) {
        $('#definedsymbolstwo').html($('#definedsymbolstwo').html() + '<b>' +key + '</b>' + '     ' + obj.globals[key]+'<br>');
    }
    for(key in obj.externals) {
        $('#notdefinedsymbolstwo').html($('#notdefinedsymbolstwo').html() + '<b>' +key + '</b>' + '     ' + obj.externals[key]+'<br>');
    }
});

$("#pass2two").click(function() {
    var code = $('#highlight2').val();
    code = passTwo(code, objTwo.symbolTable);
    $('#highlight2').val(code);
    code = passTwo(code, objTwo.symbolTable);
    $('#highlight2').val(code);

});

// For code three
$("#preprocessthree").click(function() {
    var code = $('#highlight3').val();
    $('#highlight3').val(preprocess(code));
});

$("#pass1three").click(function() {
    var code = $('#highlight3').val();
    var obj = passOne(code);
    objThree = obj;
    $('#symboltable3').html('');
    $('#definedsymbolsthree').html('');
    $('#notdefinedsymbolsthree').html('');
    for(key in obj.symbolTable) {
        $('#symboltable3').html($('#symboltable3').html() + '<b>' +key + '</b>' + '     ' + obj.symbolTable[key]+'<br>');
    }
    for(key in obj.globals) {
        $('#definedsymbolsthree').html($('#definedsymbolsthree').html() + '<b>' +key + '</b>' + '     ' + obj.globals[key]+'<br>');
    }
    for(key in obj.externals) {
        $('#notdefinedsymbolsthree').html($('#notdefinedsymbolsthree').html() + '<b>' +key + '</b>' + '     ' + obj.externals[key]+'<br>');
    }
});

$("#pass2three").click(function() {
    var code = $('#highlight3').val();
    code = passTwo(code, objThree.symbolTable);
    $('#highlight3').val(code);
    code = passTwo(code, objThree.symbolTable);
    $('#highlight3').val(code);
});

// Linker Button

$("#linkbutton").click(function() {
    var objList = [
        {
            code: $('#highlight1').val(),
            symbolTable: objOne.symbolTable,
            globals: objOne.globals
        }];
        if(!($('#highlight2').val()==="")) {
            objList.push({
                code: $('#highlight2').val(),
                symbolTable: objTwo.symbolTable,
                globals: objTwo.globals
            });
        }
       
       if(!($('#highlight3').val()==="")) {
            objList.push({
                code: $('#highlight3').val(),
                symbolTable: objThree.symbolTable,
                globals: objThree.globals
            });
        }
    
    //$('#listlink').text(link(objList));
    linkedCode = link(objList);
    color(linkedCode,0);
});

$("#highlight1").keypress(function (){
    var clr = $('#highlight1').val();
    //console.log(clr);
    color(clr,1);
});
$("#highlight2").keypress(function (){
    var clr = $('#highlight2').val();
    //console.log(clr);
    color(clr,2);
});
$("#highlight3").keypress(function (){
    var clr = $('#highlight3').val();
    //console.log(clr);
    color(clr,3);
});


////////////////////////////
    function color (linkedCode,num){
    var k = ["MOV", "MVI", "LDA", "LDAX", "LXI", "LHLD", "STA", "STAX", "SHLD", "XCHG", "SPHL", "XTHL", "PUSH", "POP", "OUT", "IN","ADD", "ADC", "ADI", "ACI", "DAD", "SUB", "SBB", "SUI", "RRC", "RAL", "RAR", "CMA", "CMC", "STC", "NOP", "HLT", "DI", "EI", "SBI", "INR", "INX", "DCR", "DCX", "DAA", "JMP", "JC", "JNC", "JP", "JM", "JZ", "JNZ", "JPE", "JPO", "CALL", "RET", "PCHL", "CMP", "CPI", "ANA", "ANI", "XRA", "XRI", "ORA", "ORI", "RLC","JEQ","JLT","JGT"];
    //adding lowercase keyword support
    var len = k.length;
    for(var i = 0; i < len; i++)
    {
        k.push(k[i].toLowerCase());
    }
    
    var re;
    var c = linkedCode; //raw code
    
    //regex time
    //highlighting special characters. /, *, + are escaped using a backslash
    //'g' = global modifier = to replace all occurances of the match
    //$1 = backreference to the part of the match inside the brackets (....)
    c = c.replace(/(=|%|\/|\*|-|,|;|\+|<|>)/g, "<span class=\"sc\">$1</span>");
    
    //strings - text inside single quotes and backticks
    c = c.replace(/(['`].*?['`])/g, "<span class=\"string\">$1</span>");
    
    //numbers - same color as strings
    c = c.replace(/(\d+)/g, "<span class=\"string\">$1</span>");
    
    //functions - any string followed by a '('
    c = c.replace(/(\w*?)\(/g, "<span class=\"function\">$1</span>(");
    
    //brackets - same as special chars
    c = c.replace(/([\(\)])/g, "<span class=\"sc\">$1</span>");
    
    //reserved 8085 keywords
    for(var i = 0; i < k.length; i++)
    {
        //regex pattern will be formulated based on the array values surrounded by word boundaries. since the replace function does not accept a string as a regex pattern, we will use a regex object this time
        re = new RegExp("\\b"+k[i]+"\\b", "g");
        c = c.replace(re, "<span class=\"keyword\">"+k[i]+"</span>");
    }
    
    //comments - tricky...
    //comments starting with a '#'
    c = c.replace(/(#.*?\n)/g, clear_spans);
    
    //comments starting with '-- '
    //first we need to remove the spans applied to the '--' as a special char
    c = c.replace(/<span class=\"sc\">-<\/span><span class=\"sc\">-<\/span>/g, "--");
    c = c.replace(/(-- .*?\n)/g, clear_spans);
    
    //comments inside /*...*/
    //filtering out spans attached to /* and */ as special chars
    c = c.replace(/<span class=\"sc\">\/<\/span><span class=\"sc\">\*<\/span>/g, "/*");
    c = c.replace(/<span class=\"sc\">\*<\/span><span class=\"sc\">\/<\/span>/g, "*/");
    //In JS the dot operator cannot match newlines. So we will use [\s\S] as a hack to select everything(space or non space characters)
    c = c.replace(/(\/\*[\s\S]*?\*\/)/g, clear_spans);
    if (num == 1) {
        $("#highlightclr").html(c);
    };
    if (num == 2) {
        $("#highlightclr").html(c);
    };
    if (num == 3) {
        $("#highlightclr").html(c);
    };
    if (num == 0) {
        $("#listlink").html(c); //injecting the code into the listrank id 
        $("#highlightclr").text("");   
    };
    //alert("fuckjhkj")
    
    //as you can see keywords are still purple inside comments.
    //we will create a filter function to remove those spans. This function will noe be used in .replace() instead of a replacement string
    function clear_spans(match)
    {
        match = match.replace(/<span.*?>/g, "");
        match = match.replace(/<\/span>/g, "");
        return "<span class=\"comment\">"+match+"</span>";
    }
}
