import { Events } from 'blockly';

export const isCreatedEvent = (event: { type: string }) => {
  return event.type === Events.BLOCK_CREATE;
}