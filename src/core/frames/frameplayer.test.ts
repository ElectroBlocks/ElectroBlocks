import 'jest';
import { ArduinoState, Timeline } from './state/arduino.state';
import { Player } from './frameplayer';
import currentStateStore from '../../stores/currentState.store';

const createFakeFrame = (
  blockId: string,
  explanation: string,
  timeline: Timeline
): ArduinoState => {
  return {
    blockId,
    explanation,
    timeLine: timeline,
    components: [],
    variables: {},
    rxLedOn: false,
    txLedOn: false,
    powerLedOn: true,
    delay: 0,
    sendMessage: '',
  };
};

describe('player tests', () => {
  const framePlayer = new Player();
  framePlayer.speed = 1000;

  let unsubscribe;
  let mockSubscribeCallBack: jest.Mock;

  const frameSet1: ArduinoState[] = [
    createFakeFrame('b_1', 'ex1', { function: 'loop', iteration: 1 }),
    createFakeFrame('b_1', 'ex1', { function: 'loop', iteration: 2 }),
    createFakeFrame('b_1', 'ex1', { function: 'loop', iteration: 3 }),
  ];

  const frameSet2: ArduinoState[] = [
    createFakeFrame('b_1', 'ex1', { function: 'loop', iteration: 1 }),
    createFakeFrame('b_2', 'ex2', { function: 'loop', iteration: 1 }),
    createFakeFrame('b_1', 'ex1', { function: 'loop', iteration: 2 }),
    createFakeFrame('b_2', 'ex2', { function: 'loop', iteration: 2 }),
  ];

  const frameSet3: ArduinoState[] = [
    createFakeFrame('b_1', 'ex1', { function: 'setup', iteration: 0 }),
    createFakeFrame('b_2', 'ex2', { function: 'setup', iteration: 0 }),
  ];

  beforeEach(() => {
    mockSubscribeCallBack = jest.fn();
    unsubscribe = currentStateStore.subscribe(mockSubscribeCallBack);
  });

  afterEach(() => {
    unsubscribe();
    mockSubscribeCallBack.mockReset();
    framePlayer.setFrames([]);
  });

  describe('setting frames', () => {
    it('should set new frame to the same looptime if available', async () => {
      await framePlayer.setFrames(frameSet2);
      await framePlayer.skipTo(3);
      expect(framePlayer.getCurrentFrame().timeLine.iteration).toBe(2);
      await framePlayer.setFrames(frameSet1);
      expect(framePlayer.getFrameNumber()).toBe(1);
      expect(framePlayer.getCurrentFrame().timeLine.iteration).toBe(2);

      expect(mockSubscribeCallBack.mock.calls.length).toBe(4);
      expect(mockSubscribeCallBack.mock.calls[1][0]).toEqual(frameSet2[0]); // starts at iteration 1
      expect(mockSubscribeCallBack.mock.calls[2][0]).toEqual(frameSet2[3]); // goes to iteration 2
      expect(mockSubscribeCallBack.mock.calls[3][0]).toEqual(frameSet1[1]); // on new timeline goes to iteration 2
    });

    it('should set loop time to the as far as it can go if available', async () => {
      await framePlayer.setFrames(frameSet1);
      await framePlayer.skipTo(2);
      expect(framePlayer.getCurrentFrame().timeLine.iteration).toBe(3);
      await framePlayer.setFrames(frameSet2);
      expect(framePlayer.getFrameNumber()).toBe(2);
      expect(framePlayer.getCurrentFrame().timeLine.iteration).toBe(2);

      expect(mockSubscribeCallBack.mock.calls.length).toBe(4); // 4 because of the beforeEach function
      expect(mockSubscribeCallBack.mock.calls[1][0]).toEqual(frameSet1[0]); // timeline is at iteration 0
      expect(mockSubscribeCallBack.mock.calls[2][0]).toEqual(frameSet1[2]); // timeline goes to iteration 3
      expect(mockSubscribeCallBack.mock.calls[3][0]).toEqual(frameSet2[2]); // because timeline set does not have iteration 3 it goes to iteration 2
    });

    it('should go to the last frame if on setup or pre setup function and setting frames', async () => {
      await framePlayer.setFrames(frameSet3);
      await framePlayer.skipTo(1);
      expect(framePlayer.getCurrentFrame().timeLine.function).toBe('setup');
      await framePlayer.setFrames(frameSet2);
      expect(framePlayer.getFrameNumber()).toBe(0);
      expect(mockSubscribeCallBack.mock.calls.length).toBe(4);
      expect(mockSubscribeCallBack.mock.calls[1][0]).toEqual(frameSet3[0]); // timeline should start at zero
      expect(mockSubscribeCallBack.mock.calls[2][0]).toEqual(frameSet3[1]); // timeline skips to the last frame
      expect(mockSubscribeCallBack.mock.calls[3][0]).toEqual(frameSet2[0]); // because because it's still in setup it should go back to 0 frame
    });
  });

  describe('playing and pausing', () => {
    it('should set be able to play all the frames', async () => {
      await framePlayer.setFrames(frameSet1);
      await framePlayer.play();
      expect(mockSubscribeCallBack.mock.calls.length).toBe(4);
      expect(mockSubscribeCallBack.mock.calls[1][0]).toEqual(frameSet1[0]);
      expect(mockSubscribeCallBack.mock.calls[2][0]).toEqual(frameSet1[1]);
      expect(mockSubscribeCallBack.mock.calls[3][0]).toEqual(frameSet1[2]);
      expect(framePlayer.playing()).toBe(false);
    });

    it('should be able to stop playing the frames', async (done) => {
      let frameNumber = 0;
      mockSubscribeCallBack.mockImplementation(() => {
        frameNumber += 1;
        if (frameNumber == 2) {
          framePlayer.pause();
          expect(framePlayer.playing()).toBe(false);
          done();
        }
      });
      await framePlayer.setFrames(frameSet1);
      await framePlayer.play();
      expect(mockSubscribeCallBack.mock.calls.length).toBe(3);
      expect(mockSubscribeCallBack.mock.calls[1][0]).toEqual(frameSet3[0]);
      expect(mockSubscribeCallBack.mock.calls[2][0]).toEqual(frameSet3[1]);
    });
  });

  describe('prev and next', () => {
    it('prev and next through a set a frames ', async () => {
      await framePlayer.setFrames(frameSet1);
      await framePlayer.next();
      await framePlayer.next();
      await framePlayer.prev();
      await framePlayer.prev();
      await framePlayer.prev();

      expect(mockSubscribeCallBack.mock.calls.length).toBe(6);
      expect(mockSubscribeCallBack.mock.calls[1][0]).toEqual(frameSet1[0]);
      expect(mockSubscribeCallBack.mock.calls[2][0]).toEqual(frameSet1[1]);
      expect(mockSubscribeCallBack.mock.calls[3][0]).toEqual(frameSet1[2]);

      expect(mockSubscribeCallBack.mock.calls[4][0]).toEqual(frameSet1[1]);
      expect(mockSubscribeCallBack.mock.calls[5][0]).toEqual(frameSet1[0]);
    });
  });
});
