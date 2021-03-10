const mongoose = require('mongoose')

const mongodb_url = 'mongodb://localhost:27017/doanhung'

class Database {
	constructor() {
		this._connect()
	}

	_connect() {
		mongoose.connect(
				mongodb_url, 
				{ 
					useNewUrlParser: true, 
					useUnifiedTopology: true, 
					useFindAndModify: false,
					useCreateIndex: true
				}
			)
			.then(() => {
				console.log('Kết nối tới cơ sở dữ liệu thành công!')
			})
			.catch(err => {
				console.log('Kết nối tới cơ sở dữ liệu thất bại!')
			})

	}
}

module.exports = new Database();