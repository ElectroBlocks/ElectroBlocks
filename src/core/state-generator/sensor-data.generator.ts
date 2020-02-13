import { BlockSvg } from 'blockly';
import { SensorData } from '../arduino-state/sensors.state';
import { getTopBlocks } from '../blockly/helpers/block.helper';
import { sensorSetupBlocks } from '../blockly/events/disableEnableBlocks';

export const getSensorData = (): SensorData[] => {
  return (
    getTopBlocks()
      .filter((block) => sensorSetupBlocks.includes(block.type))
      .reduce((prev, curr: BlockSvg) => {
        const sensorData = JSON.parse(curr.data);
        if (!sensorData) {
          return prev;
        }
        console.log(sensorData, 'sensorData');
        return [...prev, ...sensorData];
      }, []) || []
  );
};
