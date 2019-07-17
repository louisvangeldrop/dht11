"use strict";
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
var DHT11Type;
(function (DHT11Type) {
    //% block="temperature(℃)" enumval=0
    DHT11Type[DHT11Type["DHT11_temperature_C"] = 0] = "DHT11_temperature_C";
    //% block="temperature(℉)" enumval=1
    DHT11Type[DHT11Type["DHT11_temperature_F"] = 1] = "DHT11_temperature_F";
    //% block="humidity(0~100)" enumval=2
    DHT11Type[DHT11Type["DHT11_humidity"] = 2] = "DHT11_humidity";
})(DHT11Type || (DHT11Type = {}));
/**
 * Custom blocks
 */
//% weight=90 color=#0fbc11 icon="\uf0ee"
var Environment_IoT;
(function (Environment_IoT) {
    var Reference_VOLTAGE = 3100;
    /**
     * TODO: get dust(μg/m³)
     * @param vLED describe parameter here, eg: DigitalPin.P9
     * @param vo describe parameter here, eg: AnalogPin.P10
     */
    //% blockId="readdust" block="read dust(μg/m³) at vLED %vLED| vo %vo"
    function ReadDust(vLED, vo) {
        var voltage = 0;
        var dust = 0;
        pins.digitalWritePin(vLED, 0);
        control.waitMicros(160);
        voltage = pins.analogReadPin(vo);
        control.waitMicros(100);
        pins.digitalWritePin(vLED, 1);
        voltage = pins.map(voltage, 0, 1023, 0, (Reference_VOLTAGE / 2) * 3);
        dust = ((voltage - 580) * 5) / 29;
        if (dust < 0) {
            dust = 0;
        }
        return dust;
    }
    Environment_IoT.ReadDust = ReadDust;
    /**
     * TODO: get TMP36 Temperature(℃)
     * @param temppin describe parameter here, eg: AnalogPin.P0
     */
    //% blockId="readtemp" block="read temperature(℃) at pin %temppin"
    /*
      export function ReadTemperature(temppin: AnalogPin): number {
          let voltage = 0;
          let Temperature = 0;
          voltage = pins.map(
              pins.analogReadPin(temppin),
              0,
              1023,
              0,
              reference_voltage
          );
          Temperature = (voltage - 500) / 10;
          return Temperature;
      }
      */
    /**
     * TODO: get DHT11
     * @param dht11Pin describe parameter here, eg: DigitalPin.P13     */
    //% blockId="readdht11" block="read dht11 %dht11type| at pin %dht11pin"
    function temperature(dht11type, dht11Pin) {
        pins.digitalWritePin(dht11Pin, 0);
        basic.pause(18);
        var i = pins.digitalReadPin(dht11Pin);
        pins.setPull(dht11Pin, PinPullMode.PullUp);
        while (pins.digitalReadPin(dht11Pin) == 1)
            ;
        while (pins.digitalReadPin(dht11Pin) == 0)
            ;
        while (pins.digitalReadPin(dht11Pin) == 1)
            ;
        var value = 0;
        var counter = 0;
        for (var i_1 = 0; i_1 <= 32 - 1; i_1++) {
            while (pins.digitalReadPin(dht11Pin) == 0)
                ;
            counter = 0;
            while (pins.digitalReadPin(dht11Pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i_1));
            }
        }
        switch (dht11type) {
            case 0:
                return (value & 0x0000ff00) >> 8;
                break;
            case 1:
                return (((value & 0x0000ff00) >> 8) * 9) / 5 + 32;
                break;
            case 2:
                return value >> 24;
                break;
            default:
                return 0;
        }
    }
    Environment_IoT.temperature = temperature;
    /**
     * TODO: get pm2.5(μg/m³)
     * @param pm25pin describe parameter here, eg: DigitalPin.P11
     */
    //% blockId="readpm25" block="read pm2.5(μg/m³) at pin %pm25pin"
    function ReadPM25(pm25pin) {
        var pm25 = 0;
        while (pins.digitalReadPin(pm25pin) != 0) { }
        while (pins.digitalReadPin(pm25pin) != 1) { }
        pm25 = input.runningTimeMicros();
        while (pins.digitalReadPin(pm25pin) != 0) { }
        pm25 = input.runningTimeMicros() - pm25;
        pm25 = pm25 / 1000 - 2;
        return pm25;
    }
    Environment_IoT.ReadPM25 = ReadPM25;
    /**
     * TODO: get pm10(μg/m³)
     * @param pm10pin describe parameter here, eg: DigitalPin.P12     */
    //% blockId="readpm10" block="read pm10(μg/m³) at pin %pm10pin"
    function ReadPM10(pm10pin) {
        var pm10 = 0;
        while (pins.digitalReadPin(pm10pin) != 0) { }
        while (pins.digitalReadPin(pm10pin) != 1) { }
        pm10 = input.runningTimeMicros();
        while (pins.digitalReadPin(pm10pin) != 0) { }
        pm10 = input.runningTimeMicros() - pm10;
        pm10 = pm10 / 1000 - 2;
        return pm10;
    }
    Environment_IoT.ReadPM10 = ReadPM10;
    /**
     * TODO: get soil moisture(0~100)
     * @param soilmoisturepin describe parameter here, eg: AnalogPin.P2
     */
    //% blockId="readsoilmoisture" block="read soil moisture(0~100) at pin %soilhumiditypin"
    function ReadSoilHumidity(soilmoisturepin) {
        var voltage = 0;
        var soilmoisture = 0;
        voltage = pins.map(pins.analogReadPin(soilmoisturepin), 0, 1023, 0, 100);
        soilmoisture = voltage;
        return soilmoisture;
    }
    Environment_IoT.ReadSoilHumidity = ReadSoilHumidity;
    /**
     * TODO: get light intensity(0~100)
     * @param lightintensitypin describe parameter here, eg: AnalogPin.P3
     */
    //% blockId="readlightintensity" block="read light intensity(0~100) at pin %lightintensitypin"
    function ReadLightIntensity(lightintensitypin) {
        var voltage = 0;
        var lightintensity = 0;
        voltage = pins.map(pins.analogReadPin(lightintensitypin), 0, 1023, 0, 100);
        lightintensity = voltage;
        return lightintensity;
    }
    Environment_IoT.ReadLightIntensity = ReadLightIntensity;
    /**
     * TODO: get wind speed(m/s)
     * @param windspeedpin describe parameter here, eg: AnalogPin.P4
     */
    //% blockId="readwindspeed" block="read wind speed(m/s) at pin %windspeedpin"
    function ReadWindSpeed(windspeedpin) {
        var voltage = 0;
        var windspeed = 0;
        voltage = pins.map(pins.analogReadPin(windspeedpin), 0, 1023, 0, Reference_VOLTAGE);
        windspeed = voltage / 40;
        return windspeed;
    }
    Environment_IoT.ReadWindSpeed = ReadWindSpeed;
    /**
     * TODO: get noise(dB)
     * @param noisepin describe parameter here, eg: AnalogPin.P4
     */
    //% blockId="readnoise" block="read noise(dB) at pin %noisepin"
    function ReadNoise(noisepin) {
        var level = 0;
        var voltage = 0;
        var noise = 0;
        var h = 0;
        var l = 0;
        var sumh = 0;
        var suml = 0;
        for (var i = 0; i < 1000; i++) {
            level = level + pins.analogReadPin(noisepin);
        }
        level = level / 1000;
        for (var i = 0; i < 1000; i++) {
            voltage = pins.analogReadPin(noisepin);
            if (voltage >= level) {
                h += 1;
                sumh = sumh + voltage;
            }
            else {
                l += 1;
                suml = suml + voltage;
            }
        }
        if (h == 0) {
            sumh = level;
        }
        else {
            sumh = sumh / h;
        }
        if (l == 0) {
            suml = level;
        }
        else {
            suml = suml / l;
        }
        noise = sumh - suml;
        if (noise <= 28) {
            noise = pins.map(noise, 0, 28, 15, 55);
        }
        else if (noise <= 70) {
            noise = pins.map(noise, 28, 70, 55, 64);
        }
        else if (noise <= 229) {
            noise = pins.map(noise, 70, 229, 64, 76);
        }
        else {
            noise = pins.map(noise, 229, 1023, 76, 120);
        }
        return noise;
    }
    Environment_IoT.ReadNoise = ReadNoise;
})(Environment_IoT || (Environment_IoT = {}));
