import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { homeRouter } from './src/routes/home'
import { eventRouter } from './src/routes/event'
import { loginRouter } from './src/routes/login'
import { profileRouter } from './src/routes/profile'
import session from 'express-session'
import dotenv from 'dotenv'


dotenv.config()

const port = process.env.PORT

export const baseUrl = `${process.env.BASE_URL}:${port}`

export let server: ReturnType<typeof app.listen>

export const app = express()


// Set up body-parser middleware for parsing URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set  view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));


app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true
}))

// Middleware to check if user is logged in
app.use((req, res, next) => {
  if (!req.session.userId && req.path !== '/login' && req.path !== '/login/register') {
    res.redirect('/login');
  } else {
    next();
  }
})

app.use('/', homeRouter)
app.use('/event', eventRouter)
app.use('/login', loginRouter)
app.use('/profile', profileRouter)


// eslint-disable-next-line prefer-const
server = app.listen(port, () => {
  console.log(`Server läuft auf ${process.env.BASE_URL}:${port}`);
});
