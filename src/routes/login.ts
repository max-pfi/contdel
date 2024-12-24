import express from 'express'
import * as db from '../database/database'
import { baseUrl } from '../../app'
import bcrypt from 'bcrypt'


export const loginRouter = express.Router()

loginRouter.get('/', (req, res) => {
  res.render('login', {});
})

loginRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err)
    }
    res.redirect('/login')
  })
})


loginRouter.get('/register', (req, res) => {
  res.render('register', {});
})

loginRouter.post('/register', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const passwordRepeat = req.body.confirmPassword
    const name = req.body.username
    if (password !== passwordRepeat) {
      throw new Error('Passwords do not match')
    }
    const userExists = await db.getUserByEmail(email)
    console.log("email", email)
    console.log('User exists:', userExists)
    if (userExists) {
      res.redirect(baseUrl + '/login/register?error=2') // user already exists
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await db.createUser(name, email, hashedPassword, 1)
    if (result[0].affectedRows === 1) {
      res.redirect(baseUrl + '/login')
      return
    } else {
      throw new Error('User not created')
    }
  } catch (error) {
    console.log('Error creating user:', error)
    res.redirect(baseUrl + '/login/register?error=1') // any other error
  }
})

loginRouter.post('/', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await db.getUserByEmail(email)
    if (!user || !user.password || !user.email) {
      res.redirect(baseUrl + '/login?error=2') // wrong password or user not found
      return
    }
    bcrypt.compare(password, user.password!).then((match) => {
      if (match) {
        req.session.userId = user.user_id
        res.redirect(baseUrl + '/')
        return
      } else {
        res.redirect(baseUrl + '/login?error=2') // wrong password or user not found
        return
      }
    })
  } catch (error) {
    req.session.userId = undefined
    res.redirect(baseUrl + '/login?error=1') // any other error
  }
})