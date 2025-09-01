// UnifiedHardwareController.ino with dynamic pin configuration
// Supports runtime configuration via serial `config:` commands

#include <Servo.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
#include <FastLED.h>
// #include <LedControlMS.h>
#include <DHT.h>
#include <IRremote.hpp>
#include <Stepper.h>
#include <avr/wdt.h>

#define MAX_LEDS 30

// === Dynamic Pointers ===
// LedControl* ledMatrix = nullptr;
Servo servos[4];
LiquidCrystal_I2C* lcd = nullptr;
DHT* dht = nullptr;
decode_results results;
SoftwareSerial* rfidSerial = nullptr;
SoftwareSerial* bluetooth = nullptr;
Stepper* stepper = nullptr;

CRGB leds[MAX_LEDS];

// === configurable Pins ===
int servoPins[4] = { -1, -1, -1, -1 };
int rgbPins[3] = { -1, -1, -1 };
int joyPins[2] = { -1, -1 };
int thermistorPin = -1;
int dhtPin = -1;
int dhtType = DHT11;
int tmPins[2] = { -1, -1 };
int irPin = -1;
int rfidPins[2] = { -1, -1 };
int digitalReadPins[4] = { -1, -1, -1, -1 };
int buttonPins[4] = { -1, -1, -1, -1 };
int analogReadPin[4] = { -1, -1, -1, -1 };
int stepperPins[4] = { -1, -1, -1, -1 };
int ledPin = -1;
int echoPin = -1;
int trigPin = -1;

// IR REMOTE
uint32_t lastIrCode = 0;
unsigned long lastIrAt = 0;
const unsigned long IR_TIMEOUT = 1000;


void setup() {
  Serial.begin(9600);
  Serial.setTimeout(100);
  delay(100);
  while (!Serial) { ; }
  Serial.println(F("System:READY"));
  FastLED.clear();
}

void updateRFID() {
  if (!rfidSerial) return;

  // 1) Purge old/stale bytes first, but only stop when the line is quiet for ~30ms.
  {
    unsigned long lastByte = millis();
    for (;;) {
      while (rfidSerial->available()) { rfidSerial->read(); lastByte = millis(); }
      if (millis() - lastByte >= 30) break;      // "quiet" window
      delayMicroseconds(300);                     // avoid tight spin
    }
  }

  // 2) Wait briefly (<=200ms) for a *fresh* full frame to arrive.
  {
    unsigned long deadline = millis() + 200;
    while (rfidSerial->available() < 14 && millis() < deadline) {
      // just yield; no blocking reads, no delays
    }
    if (rfidSerial->available() < 14) {
      // No fresh frame -> nothing to do (optionally: Serial.print(F("rfid:none;"));
      Serial.print(F("rfid:0:"));
      return;
    }
  }

  // 3) If bytes are there but not aligned, discard until start (0x02)
  while (rfidSerial->available() && rfidSerial->peek() != 0x02) {
    rfidSerial->read();
  }

  // still not enough
  if (rfidSerial->available() < 14) 
  {
    Serial.print(F("rfid:0:;"));
    return;
  }      

  // 4) Consume start
  if (rfidSerial->read() != 0x02) {
    Serial.print(F("rfid:0:;"));
    return;
  }

  // 5) Read 10 ASCII hex chars (tag)
  char tagHex[11] = {0};
  for (int i = 0; i < 10; i++) {
    if (!rfidSerial->available()) {
        Serial.print(F("rfid:0:;"));  // partial: bail
        return;
    }
    tagHex[i] = rfidSerial->read();
  }

  // 6) Skip checksum (2 chars) and stop byte (0x03)
  if (rfidSerial->available() < 3) 
  {
      Serial.print(F("rfid:0:;"));
      return;
  }
  rfidSerial->read(); // chk hi
  rfidSerial->read(); // chk lo
  rfidSerial->read(); // stop (0x03)

  // Optional CR/LF — eat quietly
  while (rfidSerial->available()) {
    int p = rfidSerial->peek();
    if (p == '\r' || p == '\n') rfidSerial->read();
    else break;
  }

  // 7) Convert to decimal and print (your format)
  Serial.print(F("rfid:0:"));
  Serial.print(tagHex);
  Serial.print(F(";"));

  // 8) Drain any leftovers quietly so nothing stale lingers
  while (rfidSerial->available()) rfidSerial->read();
}


void updateIR() {
  if (irPin == -1) return;

  if (IrReceiver.decode()) {
    auto &d = IrReceiver.decodedIRData;
    if (!(d.flags & (IRDATA_FLAGS_WAS_OVERFLOW | IRDATA_FLAGS_IS_REPEAT))) {
      if (d.command != 0 && d.protocol != UNKNOWN) {
        lastIrCode = d.command;
        lastIrAt   = millis();
      }
    }
    IrReceiver.resume();
  }

  // Timeout logic
  if (lastIrCode != 0 && (millis() - lastIrAt > IR_TIMEOUT)) {
    lastIrCode = 0; // expire
  }

  // Always print
  if (lastIrCode != 0) {
    Serial.print(F("ir:0:"));
    Serial.print(lastIrCode, HEX);
    Serial.print(F(";"));
  } else {
    Serial.print(F("ir:0:;"));
  }
}


float readThermistor() {
  int adc = analogRead(thermistorPin);
  float voltage = adc * 5.0 / 1023.0;
  return (voltage - 0.5) * 100;
}

long readUltrasonic() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return pulseIn(echoPin, HIGH) / 58;
}

void setRGB(int r, int g, int b) {
  if (rgbPins[0] != -1) analogWrite(rgbPins[0], r);
  if (rgbPins[1] != -1) analogWrite(rgbPins[1], g);
  if (rgbPins[2] != -1) analogWrite(rgbPins[2], b);
  Serial.println(F("RGB:OK"));
}

void updateSensors() {
  updateRFID();
  updateIR();
  if (trigPin != -1 && echoPin != -1) {
    int cm = readUltrasonic();
    Serial.print(F("m:0:"));
    Serial.print(cm);
    Serial.print(F(";"));
  }
  for (int i = 0; i < 4; i += 1) {
    if (digitalReadPins[i] == -1) continue;
    int pin = digitalReadPins[i];
    Serial.print(F("dr:"));
    Serial.print(pin);
    Serial.print(F(":"));
    if (digitalRead(pin) == HIGH) {
      Serial.print(F("1;"));
    } else {
      Serial.print(F("0;"));
    }
  }

  for (int i = 0; i < 4; i += 1) {
    if (buttonPins[i] == -1) continue;
    int pin = buttonPins[i];
    Serial.print(F("b:"));
    Serial.print(pin);
    Serial.print(F(":"));
    // Caused by the input pullup resistor
    if (digitalRead(buttonPins[i]) == LOW) {
      Serial.print(F("1;"));
    } else {
      Serial.print(F("0;"));
    }
  }

  for (int i = 0; i < 4; i += 1) {
    if (analogReadPin[i] == -1) continue;
    char pin = '0' + analogReadPin[i];
    int pinState = analogRead(pin);
    Serial.print(F("ar:"));
    Serial.print(pin + ':' + pinState);
  }
  Serial.print(F("SENSE_COMPLETE\n"));
}

void handleconfig(String key, String value) {
  if (key == "servo") {
    int pin = value.toInt();
    bool assigned = false;
    for (int i = 0; i < 4; i++) {
      if (servoPins[i] == -1) {
        servoPins[i] = pin;
        servos[i].attach(pin);
        Serial.print(F("Config:ServoPIN="));
        Serial.print(pin);
        Serial.print(F(" AssignedToIndex="));
        Serial.println(i);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      Serial.println(F("Config:Servo=NO_AVAILABLE_SLOT"));
    }
  } else if (key == "m") {
    int echoIndex = value.indexOf(',');
    echoPin = value.substring(0, echoIndex).toInt();
    trigPin = value.substring(echoIndex + 1).toInt();
    Serial.println(F("config:m=OK"));
  } else if (key == "rgb") {
    int a = value.indexOf(',');
    int b = value.indexOf(',', a + 1);
    rgbPins[0] = value.substring(0, a).toInt();
    rgbPins[1] = value.substring(a + 1, b).toInt();
    rgbPins[2] = value.substring(b + 1).toInt();
    for (int i = 0; i < 3; i++) {
      pinMode(rgbPins[i], OUTPUT);
    }
    Serial.println(F("config:RGB=OK"));
  } else if (key == "lcd") {
    int firstIndex = value.indexOf(',');
    int secondIndex = value.indexOf(',', firstIndex + 1);
    int numRows = value.substring(firstIndex + 1, secondIndex).toInt();
    int numCols = value.substring(secondIndex + 1).toInt();
    lcd = new LiquidCrystal_I2C(0x27, numCols, numRows);
    lcd->init();
    lcd->backlight();
    Serial.println(F("config:LCD=OK"));
  } else if (key == "ir") {
    irPin = value.toInt();
    IrReceiver.begin(irPin, true);
    Serial.println(F("config:IR=OK"));
  } else if (key == "dr") {
    int digitalReadPin = value.toInt();
    bool assigned = false;
    for (int i = 0; i < 4; i += 1) {
      if (digitalReadPins[i] == -1) {
        digitalReadPins[i] = digitalReadPin;
        pinMode(digitalReadPin, INPUT);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      Serial.println(F("Config:DigitalRead=NoSlotAvailable"));
    }
  } else if (key == "b") {
    int buttonPin = value.toInt();
    bool assigned = false;
    for (int i = 0; i < 4; i += 1) {
      if (buttonPins[i] == -1) {
        buttonPins[i] = buttonPin;
        // Cheap Trick to have no power used
        pinMode(buttonPin, INPUT_PULLUP);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      Serial.println(F("Config:ButtonRead=NoSlotAvailable"));
    }
  } else if (key == "rfid") {
    int sep = value.indexOf(',');
    rfidPins[0] = value.substring(0, sep).toInt();
    rfidPins[1] = value.substring(sep + 1).toInt();
    rfidSerial = new SoftwareSerial(rfidPins[0], rfidPins[1]);
    rfidSerial->begin(9600);
    rfidSerial->setTimeout(100);
    Serial.println(F("config:RFID=OK"));
  } else if (key == "stepper") {
    int p1 = value.indexOf(',');
    int p2 = value.indexOf(',', p1 + 1);
    int p3 = value.indexOf(',', p2 + 1);
    stepperPins[0] = value.substring(0, p1).toInt();
    stepperPins[1] = value.substring(p1 + 1, p2).toInt();
    stepperPins[2] = value.substring(p2 + 1, p3).toInt();
    stepperPins[3] = value.substring(p3 + 1).toInt();
    stepper = new Stepper(2048, stepperPins[0], stepperPins[2], stepperPins[1], stepperPins[3]);
    Serial.println(F("config:Stepper=OK"));
  } else if (key == "thermistor") {
    thermistorPin = value.toInt();
    Serial.println(F("config:Thermistor=OK"));
  }
  // else if (key == "matrix") {
  //   int p1 = value.indexOf(',');
  //   int p2 = value.indexOf(',', p1 + 1);
  //   int p3 = value.indexOf(',', p2 + 1);
  //   int dataPin = value.substring(0, p1).toInt();
  //   int clkPin = value.substring(p1 + 1, p2).toInt();
  //   int csPin = value.substring(p2 + 1, p3).toInt();
  //   int numDevices = value.substring(p3 + 1).toInt();
  //   ledMatrix = new LedControl(dataPin, clkPin, csPin, numDevices);
  //   for (int i = 0; i < numDevices; i++) {
  //     ledMatrix->shutdown(i, false);
  //     ledMatrix->setIntensity(i, 8);
  //     ledMatrix->clearDisplay(i);
  //   }
  //   Serial.println("config:Matrix=OK");
  // }
  else if (key == "bluetooth") {
    int sep = value.indexOf(',');
    int rx = value.substring(0, sep).toInt();
    int tx = value.substring(sep + 1).toInt();
    bluetooth = new SoftwareSerial(rx, tx);
    bluetooth->begin(19200);
    Serial.println(F("config:Bluetooth=OK"));
  } else {
    Serial.print(F("config:UNKNOWN:"));
    Serial.println(key);
  }
}

void handleCommand(String input) {
  input.trim();

  if (input.startsWith("s:")) {
    int first = input.indexOf(":");
    int second = input.indexOf(":", first + 1);
    if (second != -1) {
      int pin = input.substring(first + 1, second).toInt();
      int angle = input.substring(second + 1).toInt();
      bool found = false;
      for (int i = 0; i < 4; i++) {
        if (servoPins[i] == pin) {
          servos[i].write(angle);
          Serial.print(F("Servo:PIN="));
          Serial.print(pin);
          Serial.print(F(" ANGLE="));
          Serial.print(angle);
          Serial.println(F(" OK"));
          found = true;
          break;
        }
      }
      if (!found) {
        Serial.println(F("Servo:PIN_NOT_FOUND"));
      }
    } else {
      Serial.println(F("Servo:INVALID_FORMAT"));
    }
  } else if (input.startsWith("rgb:")) {
    int r = input.substring(4, input.indexOf(',')).toInt();
    int gStart = input.indexOf(',', input.indexOf(',')) + 1;
    int gEnd = input.indexOf(',', gStart);
    int g = input.substring(gStart, gEnd).toInt();
    int b = input.substring(gEnd + 1).toInt();
    setRGB(r, g, b);
  } else if (input.startsWith("l:") && lcd) {
    String args = input.substring(2);
    if (args == "clear") {
      lcd->clear();
      Serial.println(F("LCD:CLEARED"));
    } else if (args == "scroll_right") {
      lcd->scrollDisplayRight();
      Serial.println(F("LCD:RIGHT"));
    } else if (args == "scroll_left") {
      lcd->scrollDisplayLeft();
      Serial.println(F("LCD:LEFT"));
    } else if (args == "backlighton") {
      lcd->backlight();
      Serial.println(F("LCD:BACKLIGHT_ON"));
    } else if (args == "backlightoff") {
      lcd->noBacklight();
      Serial.println(F("LCD:BACKLIGHT_OFF"));
    } else if (args.indexOf(F("cursor")) > -1) {
      int first = args.indexOf(':');
      int second = args.indexOf(':', first + 1);
      int third = args.indexOf(':', second + 1);
      bool isOn = args.substring(0, first) == "cursor_on";
      int row = args.substring(first + 1, third).toInt();
      int col = args.substring(second + 1).toInt();
      lcd->setCursor(col, row);
      if (isOn) {
        lcd->blink();
        Serial.println(F("LCD:BLINK"));
      } else {
        lcd->noBlink();
        Serial.println(F("LCD:BLINK_OFF"));
      }
    } else {
      int first = args.indexOf(':');
      int second = args.indexOf(':', first + 1);
      if (first != -1 && second != -1) {
        int row = args.substring(0, first).toInt();
        int col = args.substring(first + 1, second).toInt();
        String msg = args.substring(second + 1);
        lcd->setCursor(col, row);
        lcd->print(msg);
        Serial.println(F("LCD:OK"));
      } else {
        Serial.println(F("LCD:INVALID"));
      }
    }
  } else if (input.startsWith("m:") && stepper) {
    stepper->setSpeed(10);
    stepper->step(input.substring(2).toInt());
    Serial.println(F("Stepper:OK"));
  } else if (input.startsWith("restart:")) {
    Serial.println(F("System:RESTARTING"));
    delay(100);
    wdt_enable(WDTO_15MS);
    while (1)
      ;
  } else if (input.startsWith("dw:")) {
    int pin = input.substring(3, input.indexOf(':', 3)).toInt();
    int value = input.substring(input.indexOf(':', 3) + 1).toInt();
    pinMode(pin, OUTPUT);
    digitalWrite(pin, value);
    Serial.println(F("DigitalWrite:OK"));
  } else if (input.startsWith("dr:")) {
    int pin = input.substring(3).toInt();
    pinMode(pin, INPUT);
    int val = digitalRead(pin);
  } else if (input.startsWith("aw:")) {
    int pin = input.substring(3, input.indexOf(':', 3)).toInt();
    int value = input.substring(input.indexOf(':', 3) + 1).toInt();
    pinMode(pin, OUTPUT);
    analogWrite(pin, value);
    Serial.println(F("AnalogWrite:OK"));
  } else if (input.startsWith("ar:")) {
    int pin = input.substring(3).toInt();
    pinMode(pin, INPUT);
    int val = analogRead(pin);
    Serial.print(F("AnalogRead:"));
    Serial.println(val);
  } else if (input.startsWith("btw:")) {
    if (rfidSerial) {
      String msg = input.substring(4);
      rfidSerial->println(msg);
      Serial.println(F("BluetoothWrite:OK"));
    } else {
      Serial.println(F("BluetoothWrite:NOT_CONFIGURED"));
    }
  } else if (input == "btr:") {
    if (rfidSerial && rfidSerial->available()) {
      String btMsg = rfidSerial->readStringUntil('|');
      Serial.print("BluetoothRead:");
      Serial.println(btMsg);
    } else {
      Serial.println(F("BluetoothRead:NONE"));
    }
  } else if (input.startsWith("sw:")) {
    String msg = input.substring(3);
    Serial.println(msg);
    Serial.println(F("SerialWrite:OK"));
  }
  // else if (input.startsWith("matrix:") && ledMatrix) {
  //   String values = input.substring(7);
  //   int lastComma = -1;
  //   byte rows[8];
  //   for (int i = 0; i < 8; i++) {
  //     int nextComma = values.indexOf(',', lastComma + 1);
  //     if (i < 7 && nextComma == -1) {
  //       Serial.println(F("Matrix:INVALID_ROWS"));
  //       return;
  //     }
  //     String val = (i < 7) ? values.substring(lastComma + 1, nextComma) : values.substring(lastComma + 1);
  //     rows[i] = (byte)val.toInt();
  //     lastComma = nextComma;
  //   }
  //   for (int i = 0; i < 8; i++) {
  //     ledMatrix->setRow(0, i, rows[i]);
  //   }
  //   Serial.println(F("Matrix:OK"));
  // }
  else {
    Serial.print(F("Unknown Command: "));
    Serial.println(input);
  }
}



void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('|');
    input.trim();

    if (input == "IAM_READY") {
      Serial.println(F("System:READY"));
      return;
    }
    
    if (input == "sense") {
      updateSensors();
      return;
    }

    int commandCount = 0;
    const int maxCommands = 10;
    String commands[maxCommands];

    int start = 0;
    while (start < input.length() && commandCount < maxCommands) {
      int end = input.indexOf(';', start);
      if (end == -1) {
        end = input.length();
      }
      commands[commandCount++] = input.substring(start, end);
      start = end + 1;
    }

    for (int i = 0; i < commandCount; i++) {
      String cmd = commands[i];
      if (cmd.startsWith("config:")) {
        int eq = cmd.indexOf('=');
        if (eq != -1) {
          String key = cmd.substring(7, eq);
          String val = cmd.substring(eq + 1);
          handleconfig(key, val);
        } else {
          Serial.println(F("config:INVALID_FORMAT"));
        }
      } else {
        handleCommand(cmd);
      }
    }

    Serial.println(F("DONE_NEXT_COMMAND"));
  }
}