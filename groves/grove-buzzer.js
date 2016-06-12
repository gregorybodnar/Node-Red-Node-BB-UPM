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
        node.sensor.playSound(node.note,1000000);//default note
        this.on('input', function(msg){
            var note = parseInt(msg.payload);
            node.sensor.playSound(note,1000000);//set to note
        });
      
        //clear interval on exit
        this.on("close", function(){
            node.sensor.playSound(0,1000000);//set to note
        });
    }
    RED.nodes.registerType('UPM-Grove-Buzzer', groveBuzzer);
}
