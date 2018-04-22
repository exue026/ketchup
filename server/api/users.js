import express from 'express'
import mongoose from 'mongoose'

import {
  ensureAuthenticated,
  ensureObjectIdFormat,
} from '../middleware'

import Game from '../models/game'
import User from '../models/user'

const router = express.Router()

/* get all games of a user */
router.get('/:userId/games',
  ensureObjectIdFormat('userId'),
  async(req, res, next) => {
    try {
      const user = await User.findById(req.params.userId)
      res.send({ data: user.games })
    } catch (error) {
      console.log(error)
      res.status(500).send({ error, })
    }
})

/* create a game */
router.post('/:userId/games',
  ensureObjectIdFormat('userId'),
  async(req, res, next) => {
    const {
      gameName,
      startDate,
      endDate,
      createdBy,
      playerIds,
      startingBudget,
    } = req.body
    let gameId = mongoose.Types.ObjectId()
    try {
      const newGame = new Game({
        _id: gameId,
        name: gameName,
        start: startDate,
        end: endDate,
        createdBy: createdBy,
        players: [mongoose.Types.ObjectId(req.params.userId)],
        startingBudget: startingBudget,
      })
      const results = await newGame.save()
    } catch (err) {
      console.log(err)
      res.status(500).send({ err, })
    }
    for (let playerId of playerIds) {
      await User.update({ _id: mongoose.Types.ObjectId(playerId) }, {
        $push: {
          games: {
            _id: gameId,
            budget: startingBudget,
            coins: [],
          }
        }
      })
    }
    res.send()
  })

/* user purchases a coin */
router.put('/:userId/games/:gameId/coins', ensureObjectIdFormat('userId'), async(req, res, next) => {
  const {
    name,
    purchasedPrice,
    quantity
  } = req.body
  const query = {
    '_id': req.params.userId,
    'games._id': req.params.gameId,
  }
  try {
    const user = await User.findOne(query)
    for (let i = 0; i < user.games.length; i++) {
      if (user.games[i]._id.toString() === req.params.gameId) {
        user.games[i].budget -= (purchasedPrice * quantity)
        user.games[i].coins.push({
          _id: mongoose.Types.ObjectId(),
          coin_id: name,
          purchasedPrice: purchasedPrice,
          quantity: quantity,
        })
      }
    }
    await user.save()
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: err.error })
  }
  res.send()
})

/* user sells a coin */
router.post('/:userId/games/:gameId/coins', ensureObjectIdFormat('userId'), async(req, res, next) => {
  const {
    investmentId,
    currPrice,
    quantity,
  } = req.body
  const query = {
    "_id": req.params.userId,
  }
  try {
    const user = await User.findOne(query)
    for (let i = 0; i < user.games.length; i++) {
      if (user.games[i]._id.toString() === req.params.gameId){
        for (let j = 0; j < user.games[i].coins.length; j++) {
          let coins = user.games[i].coins
          if (coins[j]._id.toString() === investmentId) {
            user.games[i].budget += (quantity * (currPrice - coins[j].purchasedPrice))
            coins[j].quantity -= quantity
            if (coins[j].quantity <= 0) {
              user.games[i].coins.splice(j, 1)
            }
            break
          }
        }
      }
    }
    user.save()
  } catch (err) {
    res.status(500).send({ err: err.error })
  }
  res.send()
})

export default router
