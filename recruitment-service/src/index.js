import 'dotenv/config'
import cors from 'cors'
import express from 'express'

import routes from './routes'
import database from './database/database'

import auth from './middleware/AuthMiddleware'

import axios from 'axios'
const authenticateApi = axios.create({
  baseURL: process.env.AUTHENTICATE_API_URL ? process.env.AUTHENTICATE_API_URL : 'http://192.168.1.160:3002/api/authentication',
})

const app = express()

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors())

// Built-In Middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.prototype.$authenticate = authenticateApi

// * Routes * //

app.use('/api/session', routes.session)
// app.use(auth.isAuth)
app.use('/api/danh-muc', routes.category)
app.use('/api/he-thong', routes.system)
app.use('/api/tuyen-dung', routes.recruitment)
app.use('/api/nhan-vien', routes.staff)
app.use('/api/cau-hinh', routes.config)
app.use('/api/test-data', routes.test)

// * Start * //

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
)
