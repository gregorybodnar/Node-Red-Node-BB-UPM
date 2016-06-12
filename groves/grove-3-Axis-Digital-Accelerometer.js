module.exports = function(RED){

    var m = require('mraa');
    var groveSensor = require('jsupm_adxl345');

    function groveAdxl345(n){
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.unit = n.unit;
        this.interval = n.interval
        this.sensor = new groveSensor.Adxl345(parseInt(this.pin));
        this.status({});
        
        var node = this;

        var msg = { topic:node.name + '/A' + node.pin };

        //poll reading at interval
        this.timer = setInterval(function() {
            node.sensor.update(); // Update the data
            var raw = node.sensor.getRawValues(); // Read raw sensor data
            var force = node.sensor.getAcceleration(); // Read acceleration force (g)
            var rawvalues = raw.getitem(0) + " " + raw.getitem(1) + " " + raw.getitem(2);
           
           if(node.unit == 'RAW') {
                msg.payload = rawvalues;
            } else {
                msg.payload.x = force.getitem(0).toFixed(2) + " g"; //x
                msg.payload.y = force.getitem(1).toFixed(2) + " g"; //y
                msg.payload.z = force.getitem(2).toFixed(2) + " g"; //z
            }
            node.send(msg);
        }, node.interval);

        //clear interval on exit
        this.on("close", function() {
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType("upm-grove-adxl345", groveAdxl345);
}
