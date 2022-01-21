export interface VideoLesson {
  id: string;
  title: string;
  lessonUrl: string;
  videoUrl: string;
}

export interface StarterLesson {
  id: string;
  title: string;
  projectUrl: string;
  pictureUrl: string;
  lessonUrl: string;
}

export const videoLessons: Array<VideoLesson> = [
  {
    id: 'introduction',
    title: 'Introduction',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/1-introduction.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/',
  },
  {
    id: 'what-is-arduino',
    title: "What's an Arduino?",
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/2-arduino.mp4',
    lessonUrl:
      'https://electroblocks.github.io/docs/lessons/what-is-an-arduino/',
  },
  {
    id: 'blink',
    title: 'LED Blink',
    videoUrl: 'https://storage.googleapis.com/electroblocks/videos/3-blink.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/blink/',
  },
  {
    id: 'sending-messages',
    title: 'Sending Messages',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/4-sending-messages.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/sending-messages/',
  },
  {
    id: 'high-five',
    title: 'Servo - High Five',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/5-high-five.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/highfive/',
  },
  {
    id: 'wave',
    title: 'Servo - Wave',
    videoUrl: 'https://storage.googleapis.com/electroblocks/videos/6-wave.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/wave/',
  },
];

export const starterLessons: Array<StarterLesson> = [
  {
    id: 'blink',
    title: 'Blink',
    pictureUrl:
      'https://storage.googleapis.com/electroblocks/starters/blink/picture.png',
    projectUrl:
      'https://storage.googleapis.com/electroblocks/starters/blink/project.xml',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/blink/',
  },
];

/**


{
    "updated": "2021-11-18T07:55:19.506Z",
    "projectFilePath": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FCL8CFfEcsKIod58n70PM%2FprojectFile.xml?alt=media&token=f401b007-927e-4ccf-8d57-28a70bc7040b",
    "projectFileUrl": "",
    "metadata": "{\"TYPE\": \"STARTER\"}",
    "published": true,
    "mainPicture": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FCL8CFfEcsKIod58n70PM%2FmainPicture.png?alt=media&token=277c2208-8881-49ae-aa6a-055c6340ad8a",
    "type": "TUTORIALS",
    "url": "/",
    "description": "Make two LEDs blink.",
    "title": "Double Blink Starter",
    "created": "2021-11-18T07:55:19.506Z",
    "userId": "mgMqiXuPbEdHtr6UoPVbQozFQwD2",
    "id": "CL8CFfEcsKIod58n70PM"
}

{
    "url": "/",
    "updated": "2021-11-18T07:58:26.424Z",
    "mainPicture": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FhPveoHbFdDJAVlYoXSYw%2FmainPicture.png?alt=media&token=e8d04f8d-88c4-4c85-9a4e-6211e0a91fa2",
    "projectFilePath": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FhPveoHbFdDJAVlYoXSYw%2FprojectFile.xml?alt=media&token=b2c9246b-f782-41a8-8fc0-bd3ed50cfe8f",
    "metadata": "{\"TYPE\": \"STARTER\"}",
    "title": "Alternating Blink Starter",
    "userId": "mgMqiXuPbEdHtr6UoPVbQozFQwD2",
    "created": "2021-11-18T07:58:26.424Z",
    "description": "Make alternating LED Blink pattern. ",
    "published": true,
    "type": "TUTORIALS",
    "projectFileUrl": "",
    "id": "hPveoHbFdDJAVlYoXSYw"
}
 * 
 * 
 * {
    "updated": "2021-03-28T05:21:54.820Z",
    "projectFile": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FM7YjDVswT4QU8CVURJVJ%2FprojectFile.xml?alt=media&token=d4a6dced-c21a-4943-8dc3-4679d913432b",
    "published": true,
    "title": "High Five Starter",
    "projectFilePath": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FM7YjDVswT4QU8CVURJVJ%2FprojectFile.xml?alt=media&token=a14a92f3-9e2a-46e8-9c68-f838e6ab8903",
    "mainPicture": "https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FM7YjDVswT4QU8CVURJVJ%2FmainPicture.png?alt=media&token=aa081b40-713a-480f-a77c-b961fac6da3b",
    "description": "When you press the button the servo will give you a high five.",
    "type": "TUTORIALS",
    "url": "/",
    "projectFileUrl": "",
    "created": "2021-03-28T05:21:54.820Z",
    "userId": "mgMqiXuPbEdHtr6UoPVbQozFQwD2",
    "metadata": "{\"TYPE\": \"STARTER\"}",
    "id": "M7YjDVswT4QU8CVURJVJ"
}
 */
