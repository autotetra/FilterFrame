const pings = [];

exports.getPing = (req, res) => {
  res.json({ pings });
};

exports.createPing = (req, res) => {
  const newPing = {
    id: pings.length + 1,
    createdAt: new Date().toISOString(),
  };

  pings.push(newPing);

  res.status(201).json({ message: "Ping Created", ping: newPing });
};

exports.getPingById = (req, res) => {
  const { id } = req.params;

  const ping = pings.find((p) => p.id === Number(id));

  if (!ping) {
    return res.status(404).json({ message: "Ping not found" });
  }

  res.json({ ping });
};

exports.deletePing = (req, res) => {
  const { id } = req.params;
  const index = pings.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    res.status(404).json({ message: "Ping not found" });
  }

  pings.splice(index, 1);
  res.json(`Ping with id ${id} deleted`);
};
