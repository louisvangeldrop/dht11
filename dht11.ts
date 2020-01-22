/**
 * Use this file to define custom functions and blocks.
 * Read more at https://maker.makecode.com/blocks/custom
 */

// type DigitalPin = DigitalInOutPin

class DHT11 {
    /* Copyright (C) 2014 Spence Konde. See the file LICENSE for copying permission. */
    /*
          This module interfaces with a DHT11 temperature and relative humidity sensor.
          Usage (any GPIO pin can be used):
          
          var dht = require("DHT11").connect(C11);
          dht.read(function (a) {console.log("Temp is "+a.temp.toString()+" and RH is "+a.rh.toString());});
          
          */

    constructor(public pin: DigitalPin) {

    }

    public setTimeout(callBack: Function, time: number) {
        control.runInParallel(function () {
            // console.log("pause voor")
            pause(time);
            // console.log("pause na")
            callBack();
            // console.log("callback klaar")
        });
    };

    public read(
        cb: (data: { raw: number[]; rh: number; t: number; err: boolean }) => void,
        n = 10
    ) {
        let d: number[];
        let data: string = "";
        let ht = this;
        this.pin.digitalWrite(false);

        this.pin.setWatch(
            (t: any) => {
                d.push(t > 0.00005 * 1e6 ? 1 : 0);
                // console.log("CB Called");
            }
        );

        pause(20);
        this.pin.pin.setPull(PinPullMode.PullUp); // force pin state to output
        pause(50)

        /* this.setTimeout(() => {
                        this.pin.setPull(PinPullMode.PullUp)
                    }, 1); */
        // this.setTimeout(() => {
        this.pin.clearWatch(); // delete this.watch;
        let cks =
            this.decode(d.slice(2, 8)) +
            this.decode(d.slice(10, 8)) +
            this.decode(d.slice(18, 8)) +
            this.decode(d.slice(26, 8));
        if (cks && (cks & 0xff) == this.decode(d.slice(34, 8))) {
            cb({
                raw: d,
                rh: this.decode(d.slice(2, 8)),
                t: this.decode(d.slice(18, 8)),
                err: false
            });
        } else {
            if (n > 1) {
                // this.setTimeout(() => {
                pause(500)
                this.read(cb, --n);
                // }, 500);
            } else {
                cb({ raw: d, t: -1, rh: -1, err: cks > 0 });
            }
        }
        // }, 50);
    }

    public decode = (omega: number[]) => {
        let max = omega.length;
        let result = omega[max - 1] ? 1 : 0;
        let temp = 2;
        for (let i = max - 2; i > -1; i--) {
            result += omega[i] * temp;
            temp *= 2;
        }
        return result;
    };

    /**
     * Computes the famous Fibonacci number sequence!
     */
    //% block
    public temperature(): { tc: number; tf: number; rh: number } {
        this.pin.digitalWrite(false);
        pause(18);
        let j = this.pin.digitalRead();
        this.pin.pin.setPull(PinPullMode.PullUp);

        while (this.pin.digitalRead() == true);
        while (this.pin.digitalRead() == false);
        while (this.pin.digitalRead() == true);

        let value = 0;
        let counter = 0;

        for (let k = 0; k <= 32 - 1; k++) {
            while (this.pin.digitalRead() == false);
            counter = 0;
            while (this.pin.digitalRead() == true) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - k));
            }
        }
        let data2 = {
            tc: (value & 0x0000ff00) >> 8,
            tf: (((value & 0x0000ff00) >> 8) * 9) / 5 + 32,
            rh: value >> 24
        };
        return data2;
    }
}
