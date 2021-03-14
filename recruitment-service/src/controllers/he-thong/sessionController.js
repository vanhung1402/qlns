
import axios from 'axios'
import tbl_taikhoan from './accountController'

exports.getSession = async (request, response) => {
	try {
		let promise = await axios.get(
			process.env.AUTHENTICATE_API_URL + 'api/authentication/profile?token=' + request.headers.authorization,
		)

		if (promise && promise.status === 200 && promise.data) {
			let currentUser = promise.data
			currentUser.token = request.headers.authorization
			response.json(currentUser)
		} else {
			return response.status(401).json({
				message:
					'The token is either invalid or has expired. Please log in again.',
			})
		}
	} catch (e) {
		console.log(e)
		return response.status(401).json({
			message:
				'The token is either invalid or has expired. Please log in again.',
		})
	}
}

exports.getAuthentication = async (request, response) => {
	let { username, password } = request.body
	let matchedUser = await tbl_taikhoan.getAccount({ username, password })

	if (matchedUser) {
		if (matchedUser.available === 2) {
			response.status(400).json({ message: 'Tài khoản đã bị khóa, vui lòng liên hệ người quản lý để mở khóa.' })
			return
		}
		try {
			let promise = await axios.post(
				process.env.AUTHENTICATE_API_URL + 'api/authentication/login',
				matchedUser
			)

			if (promise && promise.status === 200 && promise.data) {
				matchedUser.token = promise.data.token
				matchedUser.refreshToken = promise.data.refreshToken
				response.json(matchedUser)
			} else {
				response.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' })
			}
		} catch (error) {
			console.log(error)
			response.status(500).json({ message: 'Không thể xác thực đăng nhập.' })
			return;
		}
	} else {
		response.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' })
	}
}