#include "LedMatrix.h"
#include <avr/pgmspace.h>

// ---------- Constructor ----------

LedMatrix::LedMatrix(uint8_t dinPin,
                               uint8_t clkPin,
                               uint8_t csPin,
                               Rotation rot,
                               bool isBreadboard,
                               uint8_t addr,
                               uint8_t numDevices)
  : _lc(dinPin, clkPin, csPin, numDevices),
    _addr(addr),
    _rot(isBreadboard ? breadboardPreset(rot) : rot),
    _isBreadboard(isBreadboard),
    _dirty(false)
{
  _lc.shutdown(_addr, false);
  _lc.setIntensity(_addr, 8);
  _lc.clearDisplay(_addr);

  clear(false);
  setImage(true);
}

// ---------- Public API ----------

void LedMatrix::setBuffer(const uint8_t rows[8]) {
  for (uint8_t i = 0; i < 8; i++) _logical[i] = rows[i];
  _dirty = true;
}

void LedMatrix::setBuffer_P(const uint8_t* progmemRows) {
  for (uint8_t i = 0; i < 8; i++)
    _logical[i] = pgm_read_byte(progmemRows + i);
  _dirty = true;
}

uint8_t* LedMatrix::buffer() { return _logical; }
const uint8_t* LedMatrix::buffer() const { return _logical; }

void LedMatrix::setImage(bool force) {
  if (!_dirty && !force) return;
  rotateRows(_logical, _fb);
  flush();
  _dirty = false;
}

void LedMatrix::setImage(const uint8_t rows[8]) {
  setBuffer(rows);
  setImage(true);
}

// 1-based coordinates for kids
void LedMatrix::setPixel(uint8_t x, uint8_t y, bool on) {
  if (x < 1 || x > 8 || y < 1 || y > 8) return;
  uint8_t ix = x - 1;
  uint8_t iy = y - 1;

  uint8_t mask = (0x80 >> ix);
  if (on) _logical[iy] |= mask;
  else    _logical[iy] &= ~mask;

  _dirty = true;
}

void LedMatrix::clear(bool flushNow) {
  for (uint8_t i = 0; i < 8; i++) {
    _logical[i] = 0;
    _fb[i] = 0;
  }
  _dirty = true;
  if (flushNow) setImage(true);
}

void LedMatrix::setRotation(LedMatrix::Rotation rot) {
  _rot = rot;
  _dirty = true;
}

void LedMatrix::setBreadboard(bool on) {
  _isBreadboard = on;
  _rot = on ? breadboardPreset(_rot) : _rot;
  _dirty = true;
}

void LedMatrix::setIntensity(uint8_t intensity0to15) {
  if (intensity0to15 > 15) intensity0to15 = 15;
  _lc.setIntensity(_addr, intensity0to15);
}

// ---------- Internals ----------

void LedMatrix::flush() {
  for (uint8_t row = 0; row < 8; row++)
    _lc.setRow(_addr, row, _fb[row]);
}

bool LedMatrix::getPx(const uint8_t in[8], uint8_t x, uint8_t y) {
  return (in[y] & (0x80 >> x)) != 0;
}

void LedMatrix::setPx(uint8_t out[8], uint8_t x, uint8_t y, bool on) {
  uint8_t mask = (0x80 >> x);
  if (on) out[y] |= mask;
  else    out[y] &= ~mask;
}

LedMatrix::Rotation
LedMatrix::breadboardPreset(Rotation requested) {
  if (requested == R0) return R90CW;
  return requested;
}

void LedMatrix::rotateRows(const uint8_t in[8], uint8_t out[8]) const {
  for (uint8_t i = 0; i < 8; i++) out[i] = 0;

  switch (_rot) {
    case R0:
      for (uint8_t i = 0; i < 8; i++) out[i] = in[i];
      break;

    case R180:
      for (uint8_t y = 0; y < 8; y++)
        for (uint8_t x = 0; x < 8; x++)
          setPx(out, 7 - x, 7 - y, getPx(in, x, y));
      break;

    case R90CW:
      for (uint8_t y = 0; y < 8; y++)
        for (uint8_t x = 0; x < 8; x++)
          setPx(out, 7 - y, x, getPx(in, x, y));
      break;

    case R90CCW:
      for (uint8_t y = 0; y < 8; y++)
        for (uint8_t x = 0; x < 8; x++)
          setPx(out, y, 7 - x, getPx(in, x, y));
      break;
  }
}
