//res for translation
var reDeclaration = /int (\w+);/i;
var reAssignmentMM = /(\w+) = (\w+) \+ (\w+);/i;
var reAssignmentMI = /(\w+) = (\w+) \+ (\d+);/i;
var reAssignmentIM = /(\w+) = (\d+) \+ (\w+);/i;
var reWhile = /while\((\w+)!=(\w+)\) {/i;
var endWhile = /.*}.*/i;
function translate(code) {
	code = code.split('\n');
	assCode = [];
	instStack = [];

	for(var i=0; i< code.length; i++) {
		var line = code[i].trim();
		if(!(line==="")) {
			//if declaration
			if(mt = line.match(reDeclaration)) {
				newCode.push(mt[1] + ': db 0');
			}

			//mem, mem assignment
			if(mt = line.match(reAssignmentMM)) {
				newCode.push('LXI '+ mt[2]);
				newCode.push('ADD M');
				newCode.push('LXI '+ mt[3]);
				newCode.push('ADD M');
				newCode.push('STA '+mt[1]);
			}

			//mem, i assignment
			if(mt = line.match(reAssignmentMI)) {
				newCode.push('LXI '+ mt[2]);
				newCode.push('ADD M');
				newCode.push('ADI ' + mt[3]);
				newCode.push('STA '+mt[1]);
			}

			//mem, i assignment
			if(mt = line.match(reAssignmentIM)) {
				newCode.push('ADI ' + mt[2]);
				newCode.push('LXI '+ mt[3]);
				newCode.push('ADD M');
				newCode.push('STA '+mt[1]);
			}

			//while loop not equal to
			if(mt = line.match(reWhile)) {
				newCode.push('LDA ' + mt[1]);
				newCode.push('LXI ' + mt[2]);
				newCode.push('MOV B,M');
				newCode.push('while: JEQ done');
				instStack.push('done:');
				instStack.push('JMP while');


			}
			//end while
			if(mt = line.match(endWhile)) {
				newCode.push(instStack.pop());
				newCode.push(instStack.pop());
			}
			
		}
	}

	var newString = "";
	for(var i =0; i< newCode.length; i++) {
		newString += newCode[i] + '\n';
	}

	return newString;

}