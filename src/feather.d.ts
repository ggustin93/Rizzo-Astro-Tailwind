declare module 'feather-icons' {
    const feather: {
      replace: () => void;
    };
    export default feather;
  }
  
  interface Window {
    feather: {
      replace: () => void;
    };
  }