function pad(n, width, z) {
    negative = 0;
    if(n[0]=='-') {
        n = n.slice(1);
        negative = 1;
    }
  z = z || '0';
  n = n + '';
  var res = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  if(negative) {
    res = '-' + res;
  }
  return res;
}

var instructions = {
    'MOV' : {
        size: 1,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var op = sim.getmem(pc);
            var args = (op.split(' ')[1]).split(',');
            if(args[0]==='M') {
                var val = sim.getreg('val-'+args[1].toLowerCase());
                var addr = parseInt(sim.getreg('val-h')+sim.getreg('val-l'), 16);
                sim.setmem(addr,val);

            }
            else if(args[1]==='M') {
                var addr = parseInt(sim.getreg('val-h')+sim.getreg('val-l'), 16);
                var val = sim.getmem(addr);
                sim.setreg('val-'+args[0].toLowerCase(), val);

            }
            else {
                sim.setreg('val-'+args[0].toLowerCase(), sim.getreg('val-'+args[1].toLowerCase()));
            }
            sim.setreg('val-pc', pad((pc+1).toString(16), 4));

        }
    },
    
    'MVI' : {
        size: 2,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var op = sim.getmem(pc);
            var args = op.split(' ');
            if(args[1]==='M') {
                var addr = parseInt(sim.getreg('val-h')+sim.getreg('val-l'), 16);
                var val = sim.getmem(parseInt(sim.getreg('val-pc'),16)+1);
                sim.setmem(addr,val);
            }
            else {
                var val = sim.getmem(parseInt(sim.getreg('val-pc'),16)+1);
                sim.setreg('val-'+args[1].toLowerCase(),val);
            }
            sim.setreg('val-pc',pad((pc+2).toString(16),4));
        }
    },

    'LDA' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var val = sim.getmem(parseInt(msb+lsb,16));
            sim.setreg('val-a', val);
            sim.setreg('val-pc', pad((pc+3).toString(16), 4));
        }
    },
    
    'LDAX': {size: 1},
    'LXI' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            sim.setreg('val-h', msb);
            sim.setreg('val-l', lsb);
            sim.setreg('val-pc', pad((pc+3).toString(16), 4));

        }
    },
    'LHLD': {size: 3},
    'STA' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var val = sim.getreg('val-a');
            sim.setmem(parseInt(msb+lsb,16),val);
            sim.setreg('val-pc', pad((pc+3).toString(16), 4));
        }
    },
    'STAX': {size: 1},
    'SHLD': {size: 3},
    'XCHG': {size: 1},
    'SPHL': {size: 1},
    'XTHL': {size: 1},
    'PUSH': {
        size: 1,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var op = sim.getmem(pc);
            var args = op.split(' ');
            if (args[1] === 'B') {
                sim.pushtostack(sim.getreg('val-b'));
                sim.pushtostack(sim.getreg('val-c'));
                var valuesp = parseInt(sim.getreg('val-sp'), 16);
                sim.setreg('val-sp', pad((2+valuesp).toString(16),4));
            }
            else if(args[1] === 'D') {
                sim.pushtostack(sim.getreg('val-d'));
                sim.pushtostack(sim.getreg('val-e'));
                var valuesp = parseInt(sim.getreg('val-sp'), 16);
                sim.setreg('val-sp', pad((2+valuesp).toString(16),4));
            }
            else {
                sim.pushtostack(sim.getreg('val-h'));
                sim.pushtostack(sim.getreg('val-l'));
                var valuesp = parseInt(sim.getreg('val-sp'), 16);
                sim.setreg('val-sp', pad((2+valuesp).toString(16),4));
            }
            sim.setreg('val-pc', pad((pc+1).toString(16), 4));
        }
    },
    'POP' : {
        size: 1,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var op = sim.getmem(pc);
            var args = op.split(' ');
            if (args[1] === 'B') {
                tocopy = sim.popfromstack();
                sim.setreg('val-c',tocopy);
                tocopy = sim.popfromstack();
                sim.setreg('val-b',tocopy);
                var valuesp = parseInt(sim.getreg('val-sp'), 16);
                sim.setreg('val-sp', pad((valuesp-2).toString(16),4));
            }
            else if(args[1] === 'D') {
                tocopy = sim.popfromstack();
                sim.setreg('val-e',tocopy);
                tocopy = sim.popfromstack();
                sim.setreg('val-d',tocopy);
                var valuesp = parseInt(sim.getreg('val-sp'), 16);
                sim.setreg('val-sp', pad((valuesp-2).toString(16),4));
            }
            else {
                tocopy = sim.popfromstack();
                sim.setreg('val-l',tocopy);
                tocopy = sim.popfromstack();
                sim.setreg('val-h',tocopy);
                var valuesp = parseInt(sim.getreg('val-sp'), 16);
                sim.setreg('val-sp', pad((valuesp-2).toString(16),4));
            }
            sim.setreg('val-pc', pad((pc+1).toString(16), 4));
        }
    },
    'OUT' : {size: 2},
    'IN'  : {size: 2},
    'ADD' : {
        size: 1,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var op = sim.getmem(pc);
            var args = op.split(' ');
            if(args[1]==='M') {
                var addr = parseInt(sim.getreg('val-h')+sim.getreg('val-l'), 16);
                val = parseInt(sim.getmem(addr),16);
                valuea = parseInt(sim.getreg('val-a'), 16);
                sim.setreg('val-a', pad((val+valuea).toString(16), 2));
            }
            else {
                val = parseInt(sim.getreg('val-'+args[1].toLowerCase()),16);
                valuea = parseInt(sim.getreg('val-a'),16);
                sim.setreg('val-a', pad((val+valuea).toString(16), 2));
            }
            sim.setreg('val-pc', pad((pc+1).toString(16), 4));
        }
    },
    'ADC' : {size: 1},
    'ADI' : {
        size: 2,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var toadd = parseInt(sim.getmem(pc+1),16);
            var valuea = parseInt(sim.getreg('val-a'),16);
            sim.setreg('val-a', pad((toadd+valuea).toString(16),2));
            sim.setreg('val-pc', pad((pc+2).toString(16), 4));
        }
    },
    'ACI' : {size: 2},
    'DAD' : {size: 1},
    'SUB' : {
        size: 1,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var op = sim.getmem(pc);
            var args = op.split(' ');
            if(args[1]==='M') {
                var addr = parseInt(sim.getreg('val-h')+sim.getreg('val-l'), 16);
                val = parseInt(sim.getmem(addr),16);
                valuea = parseInt(sim.getreg('val-a'), 16);
                sim.setreg('val-a', pad((valuea-val).toString(16), 2));
            }
            else {
                val = parseInt(sim.getreg('val-'+args[1].toLowerCase()),16);
                valuea = parseInt(sim.getreg('val-a'),16);
                sim.setreg('val-a', pad((valuea-val).toString(16), 2));
            }
            sim.setreg('val-pc', pad((pc+1).toString(16),4));
        }
    },
    'SBB' : {size: 1},
    'SUI' : {
        size: 2,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var tosub = parseInt(sim.getmem(pc+1),16);
            var valuea = parseInt(sim.getreg('val-a'),16);
            sim.setreg('val-a', pad((valuea-tosub).toString(16),2));
            sim.setreg('val-pc', pad((pc+2).toString(16), 4));
        }
    },
    'RRC' : {size: 1},
    'RAL' : {size: 1},
    'RAR' : {size: 1},
    'CMA' : {size: 1},
    'CMC' : {size: 1},
    'STC' : {size: 1},
    'NOP' : {
        size: 1,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            sim.setreg('val-pc', pad((pc+1).toString(16), 4));

        }
    },
    'HLT' : {
        size: 1,
        execute: function(sim) {
            window.alert('Program completed!');
            doneFlag = 1;
        }
    },
    'DI'  : {size: 1},
    'EI'  : {size: 1},
    'SBI' : {size: 2},
    'INR' : {size: 1},
    'INX' : {size: 1},
    'DCR' : {size: 1},
    'DCX' : {size: 1},
    'DAA' : {size: 1},
    'JMP' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            sim.setreg('val-pc', msb+lsb);
        }
    },
    'JC'  : {size: 3},
    'JNC' : {size: 3},
    'JP'  : {size: 3},
    'JM'  : {size: 3},
    'JZ'  : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var valuea = parseInt(sim.getreg('val-a'),16);
            if (valuea == 0) {
                sim.setreg('val-pc', msb+lsb);                
            }
            else {
                sim.setreg('val-pc', pad((pc+3).toString(16), 4));
            }
        }
    },
    'JNZ' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var valuea = parseInt(sim.getreg('val-a'),16);
            if (valuea != 0) {
                sim.setreg('val-pc', msb+lsb);                
            }
             else {
                sim.setreg('val-pc', pad((pc+3).toString(16), 4));
            }
        }
    },
    'JLT' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var valuea = parseInt(sim.getreg('val-a'),16);
            var valueb = parseInt(sim.getreg('val-b'),16);
            if (valuea < valueb) {
                sim.setreg('val-pc', msb+lsb);                
            }
             else {
                sim.setreg('val-pc', pad((pc+3).toString(16), 4));
            }
        }
    },
    'JGT' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var valuea = parseInt(sim.getreg('val-a'),16);
            var valueb = parseInt(sim.getreg('val-b'),16);
            if (valuea > valueb) {
                sim.setreg('val-pc', msb+lsb);                
            }
             else {
                sim.setreg('val-pc', pad((pc+3).toString(16), 4));
            }
        }
    },
    'JEQ' : {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            var valuea = parseInt(sim.getreg('val-a'),16);
            var valueb = parseInt(sim.getreg('val-b'),16);
            if (valuea == valueb) {
                sim.setreg('val-pc', msb+lsb);                
            }
             else {
                sim.setreg('val-pc', pad((pc+3).toString(16), 4));
            }
        }
    },
    'JPE' : {size: 3},
    'JPO' : {size: 3},
    'CALL': {
        size: 3,
        execute: function(sim) {
            var pc = parseInt(sim.getreg('val-pc'),16);
            var msb = sim.getmem(pc+1);
            var lsb = sim.getmem(pc+2);
            sim.setreg('val-pc', msb+lsb);
            var toslice = pad((pc+3).toString(16),4);
            sim.pushtostack(toslice.slice(0,2));
            sim.pushtostack(toslice.slice(2,4));
            var valuesp = parseInt(sim.getreg('val-sp'), 16);
            sim.setreg('val-sp', pad((valuesp+2).toString(16),4));
        }
    },
    'RET' : {
        size: 1,
        execute: function(sim) {
            var lsb = sim.popfromstack();
            var msb = sim.popfromstack();
            sim.setreg('val-pc', msb+lsb);
            var valuesp = parseInt(sim.getreg('val-sp'), 16);
            sim.setreg('val-sp', pad((valuesp-2).toString(16),4));
        }
    },
    'PCHL': {size: 1},
    'CMP' : {size: 1},
    'CPI' : {size: 2},
    'ANA' : {size: 1},
    'ANI' : {size: 2},
    'XRA' : {size: 1},
    'XRI' : {size: 2},
    'ORA' : {size: 1},
    'ORI' : {size: 2},
    'RLC' : {size: 1}
}

//directives
var directives = {
    'DB': {size: function(args) {
            return args.trim().split(',').length;
        },

        replace: function(args) {
            var res = [];
            args = args.trim().split(',');
            for(var i = 0; i < args.length; i++) {
                res.push('d'+args[i]);
            }
            return res;
        }

    },
    'DW': {size: function(args) {
        return args.trim().split(',').length*2;
    }}, 
    'DS': {size: function() {
        //todo: check this
        return 0;
    }},
    'EXTERN': {size: function() { return 0; },
                replace: function(args) {return [];}
            },
    'GLOBAL': {size: function() { return 0; },
               replace: function(args) {return [];}     
               }
};