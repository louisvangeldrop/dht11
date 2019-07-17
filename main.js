"use strict";
var dht11 = 0;
var temp = null;
/**
 * control.runInParallel(function () { forever(function () { serial.writeLine("?" + serial.readString()); pause(1000); }); }) Write to the SPI slave and return the response @param value Data to be sent to the SPI slave
 */
/**
 * dht.read(function (data: { raw: number[]; rh: number; t: number; err: boolean; }) { console.log(`Temperature is: ${data.t}`) })
 */
serial.setBaudRate(BaudRate.BaudRate115200);
// serial.attachToConsole();
var dht = new DHT11(pins.D11);
forever(function () {
    temp = dht.temperature();
    var dhtResult = {
        id: "sensor",
        temperature: temp.tc,
        humidity: temp.rh,
        channel: 6
    };
    var dhtJson = JSON.stringify(dhtResult);
    serial.writeLine(dhtJson);
    // console.log("" + dhtJson); console.log("" +
    // riseFall);
    pause(60000);
});
