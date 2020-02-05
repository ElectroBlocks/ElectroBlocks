declare var process: { browser: boolean };

export default () => {
  return process.browser;
}