const generatePassword = () => {
  return Math.random().toString(36).slice(-8); // ex: a9k3x2p8
};

export default generatePassword;
