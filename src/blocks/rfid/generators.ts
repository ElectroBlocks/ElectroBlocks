import Blockly from 'blockly';

Blockly["Arduino"]["rfid_scan"] = function () {
  return ["isRFIDAvailable()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["rfid_tag"] = function () {
  return ["getTagNumber()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["rfid_setup"] = function (block) {
  const txPin = block.getFieldValue("PIN_TX");
  const rxPin = block.getFieldValue("PIN_RX");
  Blockly["Arduino"].libraries_["SoftwareSerial"] =
    "#include <SoftwareSerial.h>\n";
  Blockly["Arduino"].libraries_[
    "define_rfid"
  ] = `// Plug the RFID reader's TX wire into pin ${txPin}.
// This pin RECEIVES data from the RFID reader.
SoftwareSerial rfidSerial(${txPin}, ${rxPin});

String tagCache = "";
String cardCache = "";
bool hasFrame = false;
bool rfidSensedEver = false;
`;
  Blockly["Arduino"].setupCode_["setup_rfid"] = `   rfidSerial.begin(9600);\n`;

  Blockly["Arduino"].functionNames_["rfid"] = `
// --- Internal helper: read one complete frame ---
bool readRFIDFrame(String& tagHex) {
  // 1) Purge old/stale bytes until quiet (~30ms)
  {
    unsigned long lastByte = millis();
    for (;;) {
      while (rfidSerial.available()) { rfidSerial.read(); lastByte = millis(); }
      if (millis() - lastByte >= 30) break;
      delayMicroseconds(300);
    }
  }

  // 2) Wait for fresh frame (≤200ms)
  {
    unsigned long deadline = millis() + 200;
    while (rfidSerial.available() < 14 && millis() < deadline) {}
    if (rfidSerial.available() < 14) return false;
  }

  // 3) Align to start (0x02)
  while (rfidSerial.available() && rfidSerial.peek() != 0x02) {
    rfidSerial.read();
  }
  if (rfidSerial.available() < 14) return false;

  // 4) Consume start
  if (rfidSerial.read() != 0x02) return false;

  // 5) Read 10 ASCII hex chars
  char buf[11] = {0};
  for (int i = 0; i < 10; i++) {
    if (!rfidSerial.available()) return false;
    buf[i] = rfidSerial.read();
  }

  // 6) Skip checksum (2) + stop (1)
  if (rfidSerial.available() < 3) return false;
  rfidSerial.read(); // chk hi
  rfidSerial.read(); // chk lo
  rfidSerial.read(); // stop (0x03)

  // Optional CR/LF
  while (rfidSerial.available()) {
    int p = rfidSerial.peek();
    if (p == '\\r' || p == '\\n') rfidSerial.read();
    else break;
  }

  // 7) Convert
  tagHex  = String(buf);

  // 8) Drain leftovers
  while (rfidSerial.available()) rfidSerial.read();

  return true;
}

// --- Public API ---

// Call this once per loop to refresh state
void updateRFIDState() {
  String tag;
  if (readRFIDFrame(tag)) {
    tagCache  = tag;
    hasFrame  = true;
    rfidSensedEver = true;
  } else {
    hasFrame = false;
    tagCache = "";
  }
}

bool isRFIDAvailable() {
  return hasFrame;
}

String getTagNumber() {
  return tagCache;
}

bool hasRFIDSensed() {
  return rfidSensedEver;
}
`;
  return "";
};

Blockly["Python"]["rfid_setup"] = function (block) {
  const txPin = block.getFieldValue("PIN_TX");
  const rxPin = block.getFieldValue("PIN_RX");

  Blockly["Python"].setupCode_[
    "rfid"
  ] = `eb.config_rfid(${rxPin}, ${txPin}) # Setup RFID Sensor. Recieve Pin = ${rxPin} Transmit Pn = ${txPin}\n`;

  return "";
};
Blockly["Python"]["rfid_scan"] = function () {
  return ["eb.rfid_sensed_card()", Blockly["Python"].ORDER_ATOMIC];
};
Blockly["Python"]["rfid_tag"] = function () {
  return ["eb.rfid_tag_number()", Blockly["Python"].ORDER_ATOMIC];
};

