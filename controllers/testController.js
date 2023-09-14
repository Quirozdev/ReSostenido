function homePage(req, res) {
  const variablePrueba = 'si';
  const otraVariable = 'no';
  const items = [
    {
      name: 'test1',
      price: 3.54,
    },
    {
      name: 'test341',
      price: 0.0,
    },
    {
      name: 'otrotest',
      price: 200,
    },
    {
      name: 'test1',
      price: 57,
    },
  ];

  res.render('index.html', {
    mensaje1: variablePrueba,
    mensaje2: otraVariable,
    items,
  });
}

module.exports = {
  homePage,
};
