//pad
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

//loader
function load(code) {
    console.log("HAHAHAHAHA");
    code = code.split('\n');
    var ram = [];

    for(var i=0 ; i< code.length; i++) {
        var line = code[i].trim();
        if(!(line==="")){

        var inst = line.split(' ')[0];
        var args = line.split(' ')[1];
        //data
        if(line[0]=='d') {
            ram.push(pad(line.slice(1), 2));
        }
        else if(instructions[inst].size==1) {
            ram.push(line);
        }
        else if(instructions[inst].size==3) {
            //push opcode
            ram.push(inst);
            //check args
            if(mt = args.match(reAddress)) {
                var addr = pad(parseInt(mt[1]).toString(16), 4);
                ram.push(addr[0]+addr[1]);
                ram.push(addr[2]+addr[3]);

            }
            //direct number
            else {
                var addr = pad(parseInt(args).toString(16), 4);
                ram.push(addr[0]+addr[1]);
                ram.push(addr[2]+addr[3]);
            }

        }
        //size 2 instruction
        else {
            if(line.split(',').length > 1) {
                ram.push(line.split(',')[0].trim());
                var val = pad(parseInt(line.split(',')[1].trim()).toString(16), 2);
                ram.push(val);
                
            }
            else {
                ram.push(line.split(' ')[0].trim());
                var val = pad(parseInt(line.split(' ')[1].trim()).toString(16), 2);
                ram.push(val);
            }

        }
    }

}


return ram;

}