export interface GreetingOptions {
  excited?: boolean;
}

export function greet(name: string, opts: GreetingOptions = {}): string {
  const msg = `Hello, ${name}`;
  return opts.excited ? `${msg}!!` : `${msg}.`;
}
