import express from 'express'
import mongoose from 'mongoose'

import User from '../models/user'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.send({ data: 'Hello, World!' })
  /*
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: 'exue026',
    password: 'qwe123',
    email: 'ethan.xue@gmail.com',
  })
  user.save()
    .then(error => {
      res.status(200).send({ data: 'Hello, World!' })
    })
  */
})

export default router