function homePage(req, res) {
  const variablePrueba = 'si';
  const otraVariable = 'no';
  res.render('index', {
    mensaje1: variablePrueba,
    mensaje2: otraVariable,
  });
}

module.exports = {
  homePage,
};
