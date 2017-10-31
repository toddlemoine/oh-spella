function _speak(text) {
  return new Promise(resolve => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.onend = () => {
      resolve(text);
    };
    window.speechSynthesis.speak(msg);
  });
}

export const say = text => {
  return _speak(text);
};
