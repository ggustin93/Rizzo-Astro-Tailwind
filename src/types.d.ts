declare module '*.json' {
    const value: any;
    export default value;
  }
  
  declare module 'feather-icons';
  
  interface Window {
    Calendly: any;
  }

  interface Calendly {
    initPopupWidget(options: { url: string }): void;
  }
  
  declare global {
    interface Window {
      Calendly: Calendly;
    }
    var Calendly: Calendly;
  }