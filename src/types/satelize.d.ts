declare module 'satelize' {
  interface SatelizeOptions {
    ip: string;
  }

  interface SatelizeCallback {
    (err: Error | null, payload: any): void;
  }

  interface Satelize {
    satelize(options: SatelizeOptions, callback: SatelizeCallback): void;
  }

  const satelize: Satelize;
  export default satelize;
}
