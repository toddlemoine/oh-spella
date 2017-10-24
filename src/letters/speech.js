function _speak(text) {
  return new Promise(resolve => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.onend = () => {
      console.log("end speech for", msg);
      resolve(text);
    };
    window.speechSynthesis.speak(msg);
  });
}

export const say = async text => {
  return await _speak(text);
};
