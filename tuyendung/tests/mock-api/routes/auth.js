const Users = require('../resources/users')
const axios = require('axios')

module.exports = (app) => {
  // Log in a user with a username and password
  app.post('/api/session', (request, response) => {
    Users.authenticate(request.body)
      .then((user) => {
        response.json(user)
      })
      .catch((error) => {
        response.status(400).json({ message: error.message })
      })
  })

  // Register a user with a fullname, email and password
  app.post('/api/register', (request, response) => {
    Users.register(request.body)
      .then((user) => {
        response.json(user)
      })
      .catch((error) => {
        response.status(400).json({ message: error.message })
      })
  })

  // reset password
  app.post('/api/reset', (request, response) => {
    Users.reset(request.body)
      .then((data) => {
        response.json(data)
      })
      .catch((error) => {
        response.status(400).json({ message: error.message })
      })
  })

  // Get the user of a provided token, if valid
  app.get('/api/session', async (request, response) => {
    let promise = await axios.get(
      '/api/authentication?token=' + request.headers.authorization,
    )
    .catch(err => {
        console.log(err)
        return response.status(401).json({
          message:
            'The token is either invalid or has expired. Please log in again.',
        })
      })

    if (promise.data) {
      let currentUser = promise.data
      response.json(currentUser)
    } else {
      return response.status(401).json({
        message:
          'The token is either invalid or has expired. Please log in again.',
      })
    }
  })
}
