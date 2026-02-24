#pragma once
#include <Arduino.h>

enum RfidState : uint8_t
{
    UNKNOWN = 0,
    WAITING_FOR_STX = 1,
    READING_DATA = 2,
    DATA_VALID = 3,
};

// --- Helpers ---
static uint8_t hexNib(uint8_t c)
{
    if (c >= '0' && c <= '9')
        return c - '0';
    if (c >= 'A' && c <= 'F')
        return 10 + (c - 'A');
    if (c >= 'a' && c <= 'f')
        return 10 + (c - 'a');
    return -1;
}

static RfidState dataParser(RfidState s, uint8_t c);