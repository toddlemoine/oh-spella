export const say = (text, options = {}) => {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    const msg = new SpeechSynthesisUtterance(text);
    msg.onend = () => resolve(text);
    for (let [key, val] of Object.entries(options)) {
      msg[key] = val;
    }
    synth.speak(msg);
  });
};
