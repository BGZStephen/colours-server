const express = require('express');
const router = express.Router();
const config = require('../config/database');
const User = require('../models/user');
const Palette = require('../models/palette');

// add paletteItem
router.post("/addPaletteItem", (req, res, next) => {
  let paletteObject = {
    paletteId: req.body.paletteId,
    paletteItem: {
      description: req.body.paletteItem.description,
      hex: req.body.paletteItem.hex,
    },
  }

  counterQuery = { // used to check if counter already exists
    name: "paletteItemId"
  }

  Counter.getOne(counterQuery)
  .then(result => {
    if(result == null) {
      return Promise.reject(res.json({success: false, message: "Failed to retrieve counter"}))
    } else {
      paletteObject.paletteItem.paletteItemId = result.count
      return Palette.addPaletteItem(paletteObject)
    }
  }).then(result => {
    if(result.length == 0) {
      return Promise.reject(res.json({success: false, message: "Failed to add PaletteItem"}))
    } else {
      let newCount = paletteObject.paletteItem.paletteItemId += 1;
      let counterIncrementQuery = {
        count: newCount,
        name: "paletteItemId"
      }
      return Counter.increment(counterIncrementQuery)
    }
  }).then(result => {
    if(result.nModified == 0) {
      res.json({success: false, message: "Counter update failed"})
    } else if(result.nModified >= 1) {
      res.json({success: true, message: "Palette Item added successfully"})
    }
  }).catch(error => {
    console.log(error)
  })
})

// delete paletteItem
router.post("/deletePaletteItem", (req, res, next) => {
  let paletteObject = {
    paletteId: req.body.paletteId,
    paletteItemId: req.body.paletteItemId
  }

  Palette.deletePaletteItem(paletteObject)
  .then(result => {
    if(result.nModified == 0) {
      return res.json({success: false, message: "Failed to delete PaletteItem (does it exist?)"})
    } else {
      return res.json({success: true, message: "PaletteItem deletion success"})
    }
  })
})

// create new Palette
router.post("/create", (req, res, next) => {
  let createdAtDate = new Date().getTime() // define date for user creation

  let paletteObject = new Palette({
    createdAt: createdAtDate,
    createdBy: req.body._id,
    description: req.body.description,
    name: req.body.name
  })

  counterQuery = { // used to check if counter already exists
    name: "paletteId"
  }

  Palette.create(paletteObject)
  .then(result => {
    if(result.length == 0) {
      return Promise.reject({success: false, message: "Palette creation failed"})
    } else {
      return User.addPalette(paletteObject)
    }
  }).then(result => {
    if(result.n != null) {
      return res.json({success: true, message: "Palette created successfully"})
    } else {
      return Promise.reject({success: false, message: "Failed to create Palette"})
    }
  }).catch(error => {
    console.log(error)
  })
})

// delete palette
router.post("/deleteOne", (req, res, next) => {
  let paletteObject = {
    paletteId: req.body.paletteId,
    userId: req.body.userId
  }

  let paletteQuery = {
    _id: req.body.paletteId,
  }

  Palette.getOne(paletteQuery)
  .then(result => {
    if(result == null) {
      return Promise.reject(res.json({success: false, message: "No Palette Found"}))
    } else {
      return User.deletePalette(paletteObject)
    }
  }).then(result => {
    if(result.nModified == 0) {
      return Promise.reject(res.json({success: false, message: "Failed to delete Palette"}))
    } else {
      return Palette.deleteOne(paletteQuery)
    }
  }).then(result => {
    console.log(result)
    if(JSON.parse(result).n == 1) {
      return res.json({success: true, message: "Palette deleted successfully"})
    } else {
      return Promise.reject(res.json({success: false, message: "User deletion failed"}))
    }
  }).catch(error => {
    console.log(error)
  })
})

// get by id
router.post("/getById", (req, res, next) => {
  let paletteObject = {
    _id: req.body._id
  }

  Palette.getOne(paletteObject)
  .then(result => {
    if(result == null) {
      res.json({success: false, message: "No Palette Found"})
    } else {
      res.json(result)
    }
  })
})

// get by user
router.post("/getByUserId", (req, res, next) => {
  let paletteObject = {
    createdBy: req.body.createdBy
  }

  Palette.getByUserId(paletteObject)
  .then(result => {
    if(result.length < 1) {
      return Promise.reject(res.json({success: false, message: "No palettes found for user"}))
    } else {
      res.json(result)
    }
  }).catch(error => {
    console.log(error)
  })
})

// update
router.post("/update", (req, res, next) => {
  let paletteObject = {
    description: req.body.description,
    _id: req.body._id,
    name: req.body.name
  }

  let paletteQuery = {
    _id: req.body._id,
  }

  Palette.getOne(paletteQuery)
  .then(result => {
    if(result == null) {
      return Promise.reject(res.json({success: false, message: "Failed to retrieve Palette"}))
    } else {
      return Palette.updatePalette(paletteObject)
    }
  }).then(result => {
    if(result.nModified == 0) {
      res.json({success: true, message: "Nothing to update"})
    } else if(result.nModified >= 1) {
      res.json({success: true, message: "User updated successfully"})
    }
  }).catch(error => {
    console.log(error)
  })
})

module.exports = router;
