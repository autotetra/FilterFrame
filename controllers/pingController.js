exports.getPing = (req, res) => {
  res.json({ message: "pong" });
};

exports.createPing = (req, res) => {
  res.json({ message: "created ping" });
};
