module.exports = function(RED) {

    var m = require('mraa');
    var buzzer = require('jsupm_buzzer');

    function groveBuzzer(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.note = parseInt(n.note);
        this.sensor = new buzzer.Buzzer(parseInt(this.pin));
        this.board = m.getPlatformName();
        this.status({});

        var node = this;
        node.sensor.playSound(node.note);//default note
        this.on('input', function(msg){
            var note = parseInt(msg.payload);
            note = (note < 2000 || note > 3800) ? 3000 : note; //set to center if note is out of bounds
            node.sensor.playSound(note);//set to note
        });
      
        //clear interval on exit
        this.on("close", function(){
            node.sensor.playSound(0);//set to note
        });
    }
    RED.nodes.registerType('UPM-Grove-Buzzer', groveBuzzer);
}
