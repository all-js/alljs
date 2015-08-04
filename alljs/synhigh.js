function color (linkedCode){
	var k = ["MOV", "MVI", "LDA", "LDAX", "LXI", "LHLD", "STA", "STAX", "SHLD", "XCHG", "SPHL", "XTHL", "PUSH", "POP", "OUT", "IN","ADD", "ADC", "ADI", "ACI", "DAD", "SUB", "SBB", "SUI", "RRC", "RAL", "RAR", "CMA", "CMC", "STC", "NOP", "HLT", "DI", "EI", "SBI", "INR", "INX", "DCR", "DCX", "DAA", "JMP", "JC", "JNC", "JP", "JM", "JZ", "JNZ", "JPE", "JPO", "CALL", "RET", "PCHL", "CMP", "CPI", "ANA", "ANI", "XRA", "XRI", "ORA", "ORI", "RLC"];
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
	
	$("#listlink").html(c); //injecting the code into the pre tag
	alert("fuckjhkj")
	
	//as you can see keywords are still purple inside comments.
	//we will create a filter function to remove those spans. This function will noe be used in .replace() instead of a replacement string
	function clear_spans(match)
	{
		match = match.replace(/<span.*?>/g, "");
		match = match.replace(/<\/span>/g, "");
		return "<span class=\"comment\">"+match+"</span>";
	}
})