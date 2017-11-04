export const say = text => {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    const msg = new SpeechSynthesisUtterance(text);
    synth.speak(msg);
    const id = setInterval(() => {
      if (!synth.speaking) {
        clearInterval(id);
        resolve(text);
      }
    }, 250);
  });
};
