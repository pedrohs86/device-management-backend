var express = require('express');
var router = express.Router();
const models = require('../models');
const Category = models.Category;

function checkName(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if(req.body.name.split("").length > 128) {
    return res.status(400).json({ error: 'Maximium name size 128' });
  }
  return next();
}

function checkIndex(req, res, next) {
  if (!req.params.index) {
    return res.status(400).json({ error: 'Index is required' });
  }
  return next();
}

router.get('/', (req, res) => {
  Category.findAll()
  .then((categories) => {
    var categoriesDTO = categories.map(element => {
        return {
          name: element.name,
          id: element.id
        }
    });
    return res.json(categoriesDTO);
  })
  .catch((err) => {
    console.log("Error while category creation : ", err)
    return res.status(400).json(err);
  })
})

router.post('/', checkName ,(req, res) => {
  const { name } = req.body;
  Category.create({
    name: name
  })
  .then((newCategory) => {
    return res.json(newCategory.get());
  })
  .catch((err) => {
    console.log("Error while category creation : ", err)
    return res.status(400).json(err);
  })
})

router.delete('/:index', checkIndex, (req, res) => {
  const { index } = req.params;
  Category.destroy({ where: { id: index }})
  .then((aux) => {
    // console.log(aux)
    if(!!aux) {
      return res.sendStatus(204);
    } else {
      return res.status(404).json( {
        message: 'Not Found',
        code: 404
        });
    }
  })
  .catch((err) => {
    // console.log("Error while category creation : ", err)
    if(err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Existe pelo menos um device com essa categoria',
        code: 404
        });
    }
    return res.status(400).json(err);
  })
})

module.exports = router;
