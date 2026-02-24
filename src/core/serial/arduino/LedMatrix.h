#include "LedControl.h"

class LedMatrix {
public:
  enum Rotation { R0, R90CW, R90CCW, R180 };

  // Constructor
  LedMatrix(uint8_t dinPin,
                 uint8_t clkPin,
                 uint8_t csPin,
                 Rotation rot = R0,
                 bool isBreadboard = false,
                 uint8_t addr = 0,
                 uint8_t numDevices = 1);

  // Buffer API
  void setBuffer(const uint8_t rows[8]);
  void setBuffer_P(const uint8_t* progmemRows);

  uint8_t* buffer();
  const uint8_t* buffer() const;

  // Rendering
  void setImage(bool force = false);
  void setImage(const uint8_t rows[8]);

  // 1-based, kid-friendly coordinates
  void setPixel(uint8_t x, uint8_t y, bool on);

  void clear(bool flushNow = true);
  void setRotation(Rotation rot);
  void setBreadboard(bool on);
  void setIntensity(uint8_t intensity0to15);

private:
  // Internal helpers
  static bool getPx(const uint8_t in[8], uint8_t x, uint8_t y);
  static void setPx(uint8_t out[8], uint8_t x, uint8_t y, bool on);

  void rotateRows(const uint8_t in[8], uint8_t out[8]) const;
  void flush();
  static Rotation breadboardPreset(Rotation requested);

  LedControl _lc;
  uint8_t _addr;
  Rotation _rot;
  bool _isBreadboard;
  bool _dirty;

  uint8_t _logical[8];
  uint8_t _fb[8];
};
