import {
    type Breadboard,
    MicroControllerType,
    type PinConnection,
  } from "../../core/microcontroller/microcontroller";
  import type { MicroController } from "../../core/microcontroller/microcontroller";
  
  enum WIRE_COLORS {
    PURPLE = "#B637CC",
    LIGHT_BROWN = "#CC9E37",
    GREEN = "#34CE5F",
    DEEP_PURPLE = "#5533D1",
    YELLOW = "#FFE600",
    ORANGE = "#D15F33",
  }
  
  // You can't use the last hole for power or ground
  const breadboard: Breadboard = {
    areas: [
      { holes: [3, 4, 5, 6, 7, 8], taken: false, isDown: true },
      { holes: [9, 10, 11, 12, 13, 14], taken: false, isDown: true },
      { holes: [15, 16, 17, 18, 19, 20], taken: false, isDown: true },
      { holes: [21, 22, 23, 24, 25, 26], taken: false, isDown: true },
      { holes: [27, 28, 29, 30, 31, 32], taken: false, isDown: true },
      { holes: [33, 34, 35, 36, 37, 38], taken: false, isDown: true },
      { holes: [39, 40, 41, 42, 43, 44], taken: false, isDown: true },
      { holes: [45, 46, 47, 48, 49, 50], taken: false, isDown: true },
      { holes: [51, 52, 53, 54, 55, 56], taken: false, isDown: true },
      { holes: [57, 58, 59, 60, 61, 62], taken: false, isDown: true },
    ],
    order: [4, 6, 8, 3, 5, 7, 0, 1, 2, 3, 9, 10], //TODO: not sure of this order and the pins mentoned this need to be checked as per ESP pinout
  };
  
  const pinConnections: { [key: string]: PinConnection } = {
    "16": { color: WIRE_COLORS.DEEP_PURPLE, id: "BHARATPI_PIN_16",},
    "17": { color: WIRE_COLORS.YELLOW, id: "BHARATPI_PIN_17" },
    "5": { color: WIRE_COLORS.GREEN, id: "BHARATPI_PIN_5" },
    "25": { color: WIRE_COLORS.LIGHT_BROWN, id: "BHARATPI_PIN_25" },
    "26": { color: WIRE_COLORS.ORANGE, id: "BHARATPI_PIN_26" },
    "27": { color: WIRE_COLORS.PURPLE, id: "BHARATPI_PIN_27" },
    "32": { color: WIRE_COLORS.DEEP_PURPLE, id: "BHARATPI_PIN_32" },
    "33": { color: WIRE_COLORS.YELLOW, id: "BHARATPI_PIN_33" },
    "15": { color: WIRE_COLORS.GREEN, id: "BHARATPI_PIN_15" },
    "18": {color: WIRE_COLORS.LIGHT_BROWN, id: "BHARATPI_PIN_18",},
    "19": {color: WIRE_COLORS.ORANGE, id: "BHARATPI_PIN_19",},
    "23": {color: WIRE_COLORS.PURPLE, id: "BHARATPI_PIN_23",},
    "14": {color: WIRE_COLORS.PURPLE, id: "BHARATPI_PIN_14",},
    "13": {color: WIRE_COLORS.LIGHT_BROWN, id: "BHARATPI_PIN_13",},
    "12": {color: WIRE_COLORS.GREEN, id: "BHARATPI_PIN_12",},
     "4": {color: WIRE_COLORS.DEEP_PURPLE, id: "BHARATPI_PIN_4",},
     "2": {color: WIRE_COLORS.YELLOW, id: "BHARATPI_PIN_2",},
     "0": {color: WIRE_COLORS.ORANGE, id: "BHARATPI_PIN_0",},
  };
  
  const bharatPiNodeWifi: MicroController = {
    analogPins: ["0", "2", "4", "12", "13", "14"],
    digitalPins: [
      "35",    
      "34",    
      "33",
      "32",    
      "27",   
      "26",     
      "25",
      "23",
      "22",
      "21",        
      "19",
      "18",
      "17",
      "16",
      "15",
      "14",
      "13",
      "12",
      "5",
      "4",
      "2",
      "0",
    ],
    misoPins: ["19"],
    mosiPins: ["23"],
    pwmPins: ["0", "2", "4", "5", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "23", "25", "26", "27"],
    sckPins: ["18"],
    ssPins: ["5"], //TODO: this pin mapping need to be checked as in ESP we dont have SS pin
    sclPins: ["22"],
    sdaPins: ["21"],
    serial_baud_rate: 1152000,
    type: MicroControllerType.BHARATPI_NODEWIFI,
    breadboard,
    skipHoles: [6, 7, 8, 9, 10, 11, 20, 24, 28, 29, 30, 31, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
    pinConnections,
  };

  export default bharatPiNodeWifi;
  
  
  