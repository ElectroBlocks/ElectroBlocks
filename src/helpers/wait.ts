export function wait(msTime) {
  return new Promise((resolve) => setTimeout(resolve, msTime));
}
