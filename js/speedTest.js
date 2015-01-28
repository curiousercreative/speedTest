// Requires jQuery, likes to have jQuery Cookie plugin
speedTest = {
// Private props
    // to be used for cache busting
    now: Date.now(),
    // setup our test imgs
    tests: [
        new Image(),
        new Image(),
        new Image(),
        new Image()
    ],
    testImgPath: "graphics/speedtest/",
// Public props
    speed: 0,
// Private methods
    testPing: function (callback) {
        var ping = new Image();
        ping.onload = function () {
            speedTest.ping = Date.now() - this.start;
            callback();
        }
        
        ping.start = Date.now();
        ping.src = speedTest.testImgPath+"ping.jpg?"+speedTest.now;
    },
    testSpeed: function () {        
    // our test samples
        this.tests[0].address = speedTest.testImgPath+"126kb.jpg?"+this.now;
        this.tests[0].size = 130574; // bytes
            
        this.tests[1].address =  speedTest.testImgPath+"257kb.jpg?"+this.now;
        this.tests[1].size = 264481; // bytes
        
        this.tests[2].address = speedTest.testImgPath+"517kb.jpg?"+this.now;
        this.tests[2].size = 531124; // bytes
        
        this.tests[3].address = speedTest.testImgPath+"1044kb.jpg?"+this.now;
        this.tests[3].size = 1043817; // bytes
        
    // load event handlers for each test
        for (this.i = 0; this.i < 4; this.i++) {
            this.tests[this.i].onload = function () {
                this.end = Date.now();
                this.loadTime = (this.end - this.start) / 1000; // seconds
                this.speed = this.size / this.loadTime / 1024 / 1024 * 8; // MegaBits/second
            
            // start the next one
                if (speedTest.i < 2) {
                    speedTest.i++;
                    speedTest.tests[speedTest.i].start = Date.now();
                    speedTest.tests[speedTest.i].src = speedTest.tests[speedTest.i].address;
                }
            // the last of the tests, trigger a ping test and calculate
                else if (speedTest.i == 2) {
                    speedTest.testPing(function () {
                        var ping = speedTest.ping,
                        loadTime = 0,
                        speed = 0,
                        size = 0;
                        
                    // add up all of the loadtime and size
                        for (var i = 0; i < 3; i++) {
                            loadTime += speedTest.tests[i].loadTime;
                            size += speedTest.tests[i].size;
                        }
                        
                    // subtract ping
                        loadTime -= ping*3 / 1000; // seconds
                        
                    // calculate
                        speed = size / loadTime / 1024 / 1024 * 8; // Mb/s
                        speed = speed < 0 ? 100 : speed;
                        speedTest.setSpeed(speed);
                        
                        if (speedTest.speed > 2) {
                            speedTest.i++;
                            speedTest.tests[3].start = Date.now();
                            speedTest.tests[3].src = speedTest.tests[3].address;
                        }
                        else speedTest.done();
                    });
                }
            // if the speed is high enough, run a 1mb test
                else {
                // update the speed if higher
                    if (this.speed > speedTest.speed) speedTest.setSpeed(this.speed);
                    speedTest.done();
                }
            }
        }
        
    // reset i, set the start time and load first test img
        this.i = 0;
        this.tests[this.i].start = Date.now();
        this.tests[this.i].src = this.tests[this.i].address;
    },
    setSpeed: function (speed) {
        this.speed = speed.toFixed(3);
        if ($.cookie) $.cookie('speedTest', speed);
    },
// Public methods
    // Starts the speedTest
    init: function () {
        if ($.cookie && $.cookie('speedTest')) this.speed = parseFloat($.cookie('speedTest'));
        this.testSpeed();
    },
// Event handlers
    // Event handler for when the speedTest is complete
    done: function () {

    }
}