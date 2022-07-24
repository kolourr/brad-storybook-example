const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// Login/Landing Page 
// GET/
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})




// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({ user: req.user.id }).lean()//It is important to add the lean() because that converts the mongoose documents into simple js objects 

      res.render('dashboard', {
        name: req.user.firstName,
        image: req.user.image,
        stories
      })
    } catch (err) {
      console.error(err)
      res.render('error/500') //from the error folder, we are rendering 500
    }
  })


module.exports = router 