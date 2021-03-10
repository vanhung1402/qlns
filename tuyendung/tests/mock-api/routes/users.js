const axios = require('axios')

module.exports = async (app) => {
  app.get('/api/users/:username', (request, response) => {
    console.log(1111)
    let promise = await axios.get(
      '/api/authentication/profile?token=' + request.headers.authorization,
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
