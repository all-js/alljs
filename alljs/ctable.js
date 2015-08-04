 var timer;
        $( document ).ready( function(){
            initMem();
            updateMem();
            //loadRam(['LDA', '00', '01', 'HLD']);    
        });
        var memory = {
            address : [],
            start: 0,
            end: 4095,
            current: 0,
        };

        //flags
        var S=0,Z=0,P=1;

        //stack manage
        var stackcount = 0;

        function loadRam(ram) {
            for(var i=0; i < ram.length; i++) {
                setmem(i, ram[i]);
            }

        }
        function setreg(regname,regval) {
            $("#"+regname).text(regval);
        };
        function getreg(regname) {
            return $("#"+regname).text();
        };
        function getmem(regname) {
            return $(".memory "+"#"+regname).text();
        };
        function setmem(regname,regval) {
            $(".memory "+"#"+regname).text(regval);
        };
        
        function pushtostack(content) {
            $("#stackbody").append("<tr><td id='"+stackcount+"'>"+content+"</td><tr>");
            stackcount = stackcount + 1;
        };
        function popfromstack() {
            if (stackcount > 0) {
                toremove = stackcount - 1;
                $( "#stackbody "+ "#"+toremove ).remove();
                stackcount--;           
            };
            if (stackcount == 0) {
                $("#stackbody").text("");       
            };
        };


        function initMem(){
            for(var a=memory.start;a<memory.end+1;a++){
                memory.address[a] = "00";
            }
        };

        function memToHex(number){
            if (number < 0){
                number = 0xFFFF + number + 1;
            }
            var str = number.toString(16);
            if(number>65535){
                str = str.substr(1);
            }
            if(number<16){
                return "000"+str.toUpperCase();
            }else if(number<256){
                return "00"+str.toUpperCase();
            }else if(number<4096){
                return "0"+str.toUpperCase();
            }else{
                return str.toUpperCase();
            }
        };
        function updateMem(){
            $("#tbody").text("");
            for(var a=memory.start;a<memory.end+1;a++){
                $("#tbody").append("<tr><td>"+memToHex(a)+"</td><td id='"+a+"'>"+memory.address[a]+"</td><tr>");
            }
            // setmem(0, 'LDA');
            // setmem(1, '00');
            // setmem(2, '06');
            // // setmem(3, 'MOV B,A');
            // // setmem(4, 'MOV M,A');
            // // setmem(5, 'MOV C,M');
            
            // setmem(3, 'CALL');
            // setmem(4, '00');
            // setmem(5, '0a');
            // setmem(6, 'LXI');
            // setmem(7, 'FF');
            // setmem(8, 'FF');
            // setmem(9, 'HLT');
            // setmem(10, 'RET');


            $("#stackbody").text("");
            $("#val-a").text("00");
            $("#val-b").text("00");
            $("#val-c").text("00");
            $("#val-d").text("00");
            $("#val-e").text("00");
            $("#val-h").text("00");
            $("#val-l").text("00");
            $("#val-pc").text("0000");
            $("#val-sp").text("0000");
            // setreg('val-h','05');
            // setreg('val-l','06');
            // setreg('val-b','08');
            // setreg('val-c','07');
        };



//simulator object
        var simulator = {
            stackcount: stackcount,
            setreg: function (regname,regval) {
                $("#"+regname).text(regval);
            },
            getreg: function (regname) {
                return $("#"+regname).text();
            },
            getmem: function (regname) {
                return $(".memory "+"#"+regname).text();
            },
            setmem: function (regname,regval) {
                $(".memory "+"#"+regname).text(regval);
            },

            pushtostack: function (content) {
                $("#stackbody").append("<tr><td id='"+simulator.stackcount+"'>"+content+"</td><tr>");
                simulator.stackcount = simulator.stackcount + 1;
            },
            popfromstack: function() {
                if (simulator.stackcount > 0) {
                    toremove = simulator.stackcount - 1;
                    toreturn = $( "#stackbody "+ "#"+toremove ).text();
                    $( "#stackbody "+ "#"+toremove ).remove();
                    simulator.stackcount--;         
                }
            if (simulator.stackcount == 0) {
                $("#stackbody").text("");       
            }
            return toreturn;
        }

        };
//function to execute present instruction
function execute() {
    var op = getmem(parseInt(getreg('val-pc'),16));
    var inst = op.split(' ')[0];
    if(instructions[inst]) {
        instructions[inst].execute(simulator);
    }
    else {
        console.log('Error: unrecognized operation ' + inst);
    }


}

function runall() {
    timer = setInterval(function() {
        var op = getmem(parseInt(getreg('val-pc'),16));
    var inst = op.split(' ')[0];
    if(instructions[inst]) {
        instructions[inst].execute(simulator);
    }
    else {
        console.log('Error: unrecognized operation ' + inst);
    }
    }, 200);
}
