var express = require('express');
var router = express.Router();

const models = require('../models');
const Device = models.Device;

function checkPost(req, res, next) {
  if (!req.body.color) {
    return res.status(400).json({ error: 'Color is required' });
  }
  if (!req.body.partNumber) {
    return res.status(400).json({ error: 'Part Number is required' });
  }
  if (!req.body.categoryId) {
    return res.status(400).json({ error: 'Category is required' });
  }
  if(req.body.color.split("").length > 16) {
    return res.status(400).json({ error: 'Maximium color size 16' });
  }
  if(req.body.partNumber.split(/(\d)/).filter(value=> !!value).length !== req.body.partNumber.split("").length || (parseInt(req.body.partNumber)<0)) {
    return res.status(400).json({ error: 'Part Number need to be a positive integer' });
  }
  return next();
}

function checkIndex(req, res, next) {
  if (!req.params.index) {
    return res.status(400).json({ error: 'Index is required' });
  }
  return next();
}

router.post('/', checkPost ,(req, res) => {
  const { categoryId, color, partNumber } = req.body;
  Device.create({
    categoryId,
    color,
    partNumber
  })
  .then((newDevice) => {
    return res.json(newDevice.get({include: 'category'}));
  })
  .catch((err) => {
    console.log("Error while device creation : ", err)
    return res.status(400).json(err);
  })
})

router.get('/', (req, res) => {
  Device.findAll({include: 'category'})
  .then((devices) => {
    var devicesDTO = devices.map(element => {
        return {
          id: element.id,
          color: element.color,
          partNumber: element.partNumber,
          category: {
              name: element.category.name,
              id: element.category.id
          }
        }
    });
    return res.json(devicesDTO);
  })
  .catch((err) => {
    console.log("Error while category creation : ", err)
    return res.status(400).json(err);
  })
})

router.delete('/:index', checkIndex, (req, res) => {
  const { index } = req.params;
  Device.destroy({ where: { id: index }})
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
    console.log("Error while category creation : ", err)
    return res.status(400).json(err);
  })
})

module.exports = router;

