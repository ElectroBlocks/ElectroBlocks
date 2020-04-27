import { ArduinoState } from './state/arduino.state';
import currentStateStore from '../../stores/currentState.store';

export class Player {
  private isPlaying = false;

  private frames: ArduinoState[] = [];

  private frameNumber = 0;

  public speed = 1;

  public async setFrames(newFrames: ArduinoState[]) {
    const currentIteration = this.currentIteration();
    this.frames = newFrames;
    if (currentIteration <= 1 || this.frames.length === 0) {
      this.frameNumber = 0;
      currentStateStore.set(this.getCurrentFrame());
      return;
    }

    const index = this.frames.findIndex(
      (f) => f.timeLine.iteration === currentIteration
    );

    if (index > -1) {
      this.frameNumber = index;
      currentStateStore.set(this.getCurrentFrame());
      return;
    }

    const lastIteration = this.frames[this.frames.length - 1].timeLine
      .iteration;

    const newFrameNumber = this.frames.findIndex(
      (f) => f.timeLine.iteration === lastIteration
    );

    this.frameNumber = newFrameNumber;
    currentStateStore.set(this.getCurrentFrame());
    return;
  }

  public async play() {
    this.isPlaying = true;
    await this.playFrame();
  }

  public async pause() {
    this.isPlaying = false;
  }

  public async skipTo(frameNumber) {
    if (this.frames[frameNumber]) {
      this.frameNumber = frameNumber;
      currentStateStore.set(this.getCurrentFrame());
    }
  }

  public async next() {
    if (this.isLastFrame()) {
      return;
    }
    this.frameNumber += 1;
    currentStateStore.set(this.getCurrentFrame());
  }

  public async prev() {
    if (this.frameNumber === 0) {
      return;
    }
    this.frameNumber -= 1;
    currentStateStore.set(this.getCurrentFrame());
  }

  public getFrameNumber() {
    return this.frameNumber;
  }

  public getCurrentFrame() {
    return this.frames[this.frameNumber];
  }

  public currentIteration() {
    if (this.frames.length === 0) {
      return 0;
    }
    return this.getCurrentFrame().timeLine.iteration;
  }

  private async playFrame() {
    if (!this.isPlaying) {
      return;
    }
    this.frameNumber += 1;
    await this.moveWait();
    currentStateStore.set(this.getCurrentFrame());

    if (this.isLastFrame()) {
      this.isPlaying = false;
      return;
    }

    await this.playFrame();
  }

  public isLastFrame() {
    return this.frames.length - 1 === this.frameNumber;
  }

  public playing() {
    return this.isPlaying;
  }

  private moveWait() {
    return new Promise((resolve) => setTimeout(resolve, 800 / this.speed));
  }
}
