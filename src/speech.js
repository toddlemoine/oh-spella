export const say = (text, options = {}) => {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    const msg = new SpeechSynthesisUtterance(text);

    for (let [key, val] of Object.entries(options)) {
      msg[key] = val;
    }

    msg.onerror = err => console.error("speech error", err);

    synth.speak(msg);

    function checkIfSpeaking() {
      if (synth.speaking) {
        resolve(text);
        clearInterval(speechCheckIntervalId);
      }
    }

    const speechCheckIntervalId = setInterval(checkIfSpeaking, 250);
  });
};
