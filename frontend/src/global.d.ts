export {};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  const SpeechRecognition: any;
  const webkitSpeechRecognition: any;
}
