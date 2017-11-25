export const say = text => {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    const msg = new SpeechSynthesisUtterance(text);
    msg.onend = () => resolve(text);
    synth.speak(msg);
  });
};
