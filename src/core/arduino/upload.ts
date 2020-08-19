import selectedBoard from '../blockly/selectBoard';

declare class AvrgirlArduino {
  constructor(config: any);

  flash(hex: string, call: (error) => void): void;
}

export const upload = async (code: string, avrgirl: AvrgirlArduino) => {
  const hexCode = await compileCode(code);

  var enc = new TextEncoder();
  return new Promise((res, rej) => {
    avrgirl.flash(enc.encode(hexCode) as any, (error) => {
      if (error) {
        rej(error);
      } else {
        res('flash successful');
      }
    });
  });
};

const compileCode = async (code: string): Promise<string> => {
  const headers = new Headers();
  headers.append('Content-Type', 'text/plain');

  const response = await fetch(
    `https://arduino-compile.noahglaser.net/upload-code/${
      selectedBoard().type
    }`,
    {
      method: 'POST',
      body: code,
      headers,
    }
  );

  return await response.text();
};

const uploadCodeToArduino = async (hexCode: string) => {};
