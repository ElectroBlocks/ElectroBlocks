import { Element } from "@svgdotjs/svg.js";
import { getTopBlocks } from "../blockly/helpers/block.helper";

const BOTTOM_MIDDLE_HOLES = ["A", "B", "C", "D", "E"];
const TOP_MIDDLE_HOLES = ["F", "G", "H", "I", "J"];
const RAILS = ["W", "X", "Y", "Z"];
export const registerHighlightEvents = (arduino: Element) => {
  arduino.find("#sockets > g").forEach((pin) => {
    pin.node.addEventListener("mouseover", (e) => {
      const id = e.target.parentElement.id;
      if (id && id.includes("pin")) {
        const pinNumber = id.replace("pin", "");
        const letter = pinNumber.split("").pop();
        const number = +pinNumber.replace(letter, "");
        if (BOTTOM_MIDDLE_HOLES.includes(letter)) {
          BOTTOM_MIDDLE_HOLES.forEach((l) => {
            arduino.find(`#pin${number}${l} path`).forEach((path) => {
              path.node.style.fill = "#09bd21";
            });
          });
        }

        if (TOP_MIDDLE_HOLES.includes(letter)) {
          TOP_MIDDLE_HOLES.forEach((l) => {
            arduino.find(`#pin${number}${l} path`).forEach((path) => {
              path.node.style.fill = "#09bd21";
            });
          });
        }

        if (RAILS.includes(letter)) {
          for (let i = 3; i <= 61; i += 1) {
            arduino.find(`#pin${i}${letter} path`).forEach((path) => {
              path.node.style.fill = "#09bd21";
            });
          }
        }
      }
    });

    pin.node.addEventListener("mouseout", (e) => {
      const id = e.target.parentElement.id;
      if (id && id.includes("pin")) {
        const pinNumber = id.replace("pin", "");
        const letter = pinNumber.split("").pop();
        const number = +pinNumber.replace(letter, "");

        if (BOTTOM_MIDDLE_HOLES.includes(letter)) {
          BOTTOM_MIDDLE_HOLES.forEach((l) => {
            (arduino.findOne(
              `#pin${number}${l} path:first-of-type`
            ) as Element).node.style.fill = "#bfbfbf";

            (arduino.findOne(
              `#pin${number}${l} path:last-of-type`
            ) as Element).node.style.fill = "#e6e6e6";
          });
        }

        if (TOP_MIDDLE_HOLES.includes(letter)) {
          TOP_MIDDLE_HOLES.forEach((l) => {
            (arduino.findOne(
              `#pin${number}${l} path:first-of-type`
            ) as Element).node.style.fill = "#bfbfbf";

            (arduino.findOne(
              `#pin${number}${l} path:last-of-type`
            ) as Element).node.style.fill = "#e6e6e6";
          });
        }

        if (RAILS.includes(letter)) {
          for (let i = 3; i <= 61; i += 1) {
            const bottomPath = arduino.findOne(
              `#pin${i}${letter} path:last-of-type`
            );
            const topPath = arduino.findOne(
              `#pin${i}${letter} path:first-of-type`
            );

            if (bottomPath && getTopBlocks) {
              (bottomPath as Element).node.style.fill = "#e6e6e6";
              (topPath as Element).node.style.fill = "#bfbfbf";
            }
          }
        }
      }
    });
  });
};
