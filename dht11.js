"use strict";
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://maker.makecode.com/blocks/custom
 */
var DHT11 = /** @class */ (function () {
    /* Copyright (C) 2014 Spence Konde. See the file LICENSE for copying permission. */
    /*
          This module interfaces with a DHT11 temperature and relative humidity sensor.
          Usage (any GPIO pin can be used):
          
          var dht = require("DHT11").connect(C11);
          dht.read(function (a) {console.log("Temp is "+a.temp.toString()+" and RH is "+a.rh.toString());});
          
          */
    function DHT11(pin) {
        this.pin = pin;
        this.setWatch = function (callBack, pin, mode) {
            pin.onEvent(PinEvent.Rise, function () { return callBack(pins.pulseDuration()); });
            pin.onEvent(PinEvent.Fall, function () { return callBack(pins.pulseDuration()); });
        };
        this.clearWatch = function (pin) {
            pin.onEvent(PinEvent.Fall, function () { });
            pin.onEvent(PinEvent.Rise, function () { });
        };
        this.setTimeout = function (callBack, time) {
            control.runInParallel(function () {
                // console.log("pause voor")
                pause(time);
                // console.log("pause na")
                callBack();
                // console.log("callback klaar")
            });
        };
        this.decode = function (omega) {
            var max = omega.length;
            var result = omega[max - 1] ? 1 : 0;
            var temp = 2;
            for (var i = max - 2; i > -1; i--) {
                result += omega[i] * temp;
                temp *= 2;
            }
            return result;
        };
        // this.pin = pin;
    }
    DHT11.prototype.read = function (cb, n) {
        var _this = this;
        if (n === void 0) { n = 10; }
        var d;
        var data = "";
        var ht = this;
        this.pin.digitalWrite(false);
        pause(18);
        this.pin.setPull(PinPullMode.PullUp); // force pin state to output
        this.setWatch(function (t) {
            d.push(t > 0.00005 * 1e6 ? 1 : 0);
            console.log("CB Called");
        }, this.pin, { edge: "falling", repeat: true });
        /* this.setTimeout(() => {
                        this.pin.setPull(PinPullMode.PullUp)
                    }, 1); */
        this.setTimeout(function () {
            _this.clearWatch(_this.pin); // delete this.watch;
            var cks = _this.decode(d.slice(2, 8)) +
                _this.decode(d.slice(10, 8)) +
                _this.decode(d.slice(18, 8)) +
                _this.decode(d.slice(26, 8));
            if (cks && (cks & 0xff) == _this.decode(d.slice(34, 8))) {
                cb({
                    raw: d,
                    rh: _this.decode(d.slice(2, 8)),
                    t: _this.decode(d.slice(18, 8)),
                    err: false
                });
            }
            else {
                if (n > 1) {
                    _this.setTimeout(function () {
                        _this.read(cb, --n);
                    }, 500);
                }
                else {
                    cb({ raw: d, t: -1, rh: -1, err: cks > 0 });
                }
            }
        }, 50);
    };
    /**
     * Computes the famous Fibonacci number sequence!
     */
    //% block
    DHT11.prototype.temperature = function () {
        this.pin.digitalWrite(false);
        pause(18);
        var j = this.pin.digitalRead();
        this.pin.setPull(PinPullMode.PullUp);
        while (this.pin.digitalRead() == true)
            ;
        while (this.pin.digitalRead() == false)
            ;
        while (this.pin.digitalRead() == true)
            ;
        var value = 0;
        var counter = 0;
        for (var k = 0; k <= 32 - 1; k++) {
            while (this.pin.digitalRead() == false)
                ;
            counter = 0;
            while (this.pin.digitalRead() == true) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - k));
            }
        }
        var data2 = {
            tc: (value & 0x0000ff00) >> 8,
            tf: (((value & 0x0000ff00) >> 8) * 9) / 5 + 32,
            rh: value >> 24
        };
        return data2;
    };
    return DHT11;
}());
var MyEnum;
(function (MyEnum) {
    //% block="one"
    MyEnum[MyEnum["One"] = 0] = "One";
    //% block="two"
    MyEnum[MyEnum["Two"] = 1] = "Two";
})(MyEnum || (MyEnum = {}));
/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
var custom;
(function (custom) {
    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block
    function foo(n, s, e) {
        // Add code here
    }
    custom.foo = foo;
    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block
    function fib(value) {
        return value <= 1 ? value : fib(value - 1) + fib(value - 2);
    }
    custom.fib = fib;
})(custom || (custom = {}));
