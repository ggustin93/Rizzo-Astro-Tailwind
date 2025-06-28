declare module '*.json' {
    const value: any;
    export default value;
  }
  
  declare module 'feather-icons';
  
  interface Window {
    Cal: any;
  }

  interface Cal {
    init(options: { origin: string }): void;
  }
  
  declare global {
    interface Window {
      Cal: Cal;
    }
    var Cal: Cal;
  }