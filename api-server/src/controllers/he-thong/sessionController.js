
import axios from 'axios'
import Account from './accountController'

exports.getSession = async (request, response) => {
	let promise = await axios.get(
		'http://localhost:3080/api/authentication/profile?token=' + request.headers.authorization,
	)
		.catch(err => {
			return response.status(401).json({
				message:
					'The token is either invalid or has expired. Please log in again.',
			})
		})

	if (promise.data) {
		let currentUser = promise.data
		currentUser.token = request.headers.authorization
		response.json(currentUser)
	} else {
		return response.status(401).json({
			message:
				'The token is either invalid or has expired. Please log in again.',
		})
	}
}

exports.getAuthentication = async (request, response) => {
	let { username, password } = request.body
	let matchedUser = await Account.getAccount({ username, password })

	if (matchedUser) {
		let promise = await axios.post(
			'http://localhost:3080/api/authentication/login',
			matchedUser
		)

		if (promise.data) {
			if (matchedUser.available === 2) {
				response.status(400).json({ message: 'Tài khoản đã bị khóa, vui lòng liên hệ người quản lý để mở khóa.' })
			} else {
				matchedUser.token = promise.data.token
				matchedUser.refreshToken = promise.data.refreshToken
				response.json(matchedUser)
			}
		} else {
			response.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' })
		}
	} else {
		response.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' })
	}
}