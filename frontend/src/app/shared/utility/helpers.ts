export function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
