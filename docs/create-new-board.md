# Creating a new Board

1\. Go to src -> microcontroller and create a new folder

2\. Create a profile.ts file will default export a [Microcontroller]().

3\. Create your board with wires coming out of the holes for your board.  The ends of each wire should be labeled with a unique id that is repeatable.  In the Mega board each wire is labeled ARDUINO_MEGA_9, or ARDUINO_MEGA_10.

4\. Then go to src -> core -> selectBoard.ts and add it to the boardProfiles constant.

5\. Then go to src -> core -> get-board-svg.ts and add it to the boardSvg constant.

6\. Go to the core -> microcontroller -> microcontroller.ts and add your boardtype.

7\. Then go to src -> routes -> settings -> index.svelte and add it to the drop down list.