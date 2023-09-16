const db = require('../db/db');

async function homePage(req, res) {
  const { id } = req.params;
  const [usuarios, campos] = await db.execute(
    'SELECT * FROM `usuarios` WHERE `id` = ?',
    [id]
  );

  res.render('test.html', {
    usuario: usuarios[0],
  });
}

module.exports = {
  homePage,
};
