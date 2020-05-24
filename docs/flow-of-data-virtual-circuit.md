# Flow of Data For Virtual Circuit

1. In Events come into block we only try to act on the ones that change the flow
   of the code.

2. We take the blocks and turn them into typescript objects. The interfaces we
   model the object off of are in the dto (data transfer objects) folder in
   blockly -> core. We use to turn the blocks into the objects are blockly
   transformer folder.

3. We then pass the typescript objects to create actions. Actions determine if
   we should disable a block or change a block based on what is in the program.
   Example would be saving data into a block for a sensor block setup block that
   will store all the states of a sensor through out the program. Another
   example would be disabling blocks because they take up the same pin.

4. We then pass the list of actions updater which will update the blocks
   themselves. An updater is a function that updates the blocks.

5. Once the blocks have been updated we get a new list of typescript object
   blocks and pass that into the event to frame factory.

6. The event to frame factory will transform each typescript block from pre
   setup blocks to setup blocks to loop blocks to a frame. A frame represents
   the current state that the Arduino is in.

7. Once all the frames are generated they are saved to a store and consumed by
   the a virtual circuit folder in core. You can look at that as one gaint
   updater for svg circuit.

---

## Side Note

In the blockly core folder there is a folder called generator. This is for
turning the blocks into c code to run on the actual arduino.
