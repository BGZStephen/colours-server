const express = require('express');
const router = express.Router();
const config = require('../config');
const User = require('../models/user');
const Palette = require('../models/palette');
const PaletteItem = require('../models/palette-item');
const jwt = require('jsonwebtoken')

// create new Palette
router.post("", (req, res, next) => {

  if(!req.get('Authorization')) {
    return res.status(401).json({error: "Authorisation token not supplied"})
  }

  let verifiedJwt = jwt.verify(req.get('Authorization'), config.secret)

  if(verifiedJwt == undefined) {
    res.status(403).json({error: "Authorization token not valid"})
  } else {
    let paletteObject = new Palette({
      createdAt: new Date(),
      createdBy: req.body.createdBy,
      description: req.body.description,
      name: req.body.name
    })

    Palette.create(paletteObject)
    .then(User.addPalette(paletteObject))
    .then(result => {
      res.json(result)
    }).catch(error => {
      res.json(error)
    })
  }
})

// delete palette
router.delete("/:paletteId", (req, res, next) => {

  if(!req.get('Authorization')) {
    return res.status(401).json({error: "Authorisation token not supplied"})
  }

  let verifiedJwt = jwt.verify(req.get('Authorization'), config.secret)

  if(verifiedJwt == undefined) {
    res.status(403).json({error: "Authorization token not valid"})
  } else {

    let paletteQuery = {
      _id: req.params.paletteId,
    }

    Palette.getOne(paletteQuery)
    .then(result => {
      return [
        PaletteItem.deletePaletteItems(result.paletteItems),
        User.deletePalette({paletteId: result._id, userId: result.createdBy})
      ]
    })
    .then(Palette.deleteOne(paletteQuery))
    .then(result => {
      res.json(result)
    }).catch(error => {
      res.json(error)
    })
  }
})

// get by id
router.get("", (req, res, next) => {
  if(!req.get('Authorization')) {
    return res.status(401).json({error: "Authorisation token not supplied"})
  }

  let verifiedJwt = jwt.verify(req.get('Authorization'), config.secret)

  if(verifiedJwt == undefined) {
    res.status(403).json({error: "Authorization token not valid"})
  } else {

    if(req.query._id) {
      paletteObject = {
        _id: req.query._id
      }

      Palette.getOne(paletteObject)
      .then(result => {
        res.json(result)
      }).catch(error => {
        res.json(error)
      })

    } else if(req.query.userId) {
      paletteObject = {
        createdBy: req.query.userId
      }

      Palette.getByUserId(paletteObject)
      .then(result => {
        res.json(result)
      }).catch(error => {
        res.json(error)
      })
    }
  }
})

// update
router.put("/:paletteId", (req, res, next) => {
  if(!req.get('Authorization')) {
    return res.status(401).json({error: "Authorisation token not supplied"})
  }

  let verifiedJwt = jwt.verify(req.get('Authorization'), config.secret)

  if(verifiedJwt == undefined) {
    res.status(403).json({error: "Authorization token not valid"})
  } else {
    let paletteObject = {
      description: req.body.description,
      _id: req.body._id,
      name: req.body.name
    }

    let paletteQuery = {
      _id: req.body._id,
    }

    Palette.getOne(paletteQuery)
    .then(Palette.updatePalette(paletteObject)).then(result => {
      res.json(result)
    }).catch(error => {
      res.json(error)
    })
  }
})

module.exports = router;
