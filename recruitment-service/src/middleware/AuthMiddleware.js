import axios from 'axios'

let isAuth = async (req, res, next) => {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;

  if (tokenFromClient) {
    try {
      let promise = await axios.get(
        'http://192.168.1.160:3002/api/authentication/profile?token=' + tokenFromClient,
      )
        .catch(err => {
          throw err
        })
    
      if (promise.status === 200 && promise.data) {
        req.jwtDecoded = promise.data
      }else{
        throw new Error('Unauthorized.')
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

module.exports = {
  isAuth: isAuth,
};
