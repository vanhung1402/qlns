const mongoose = require('mongoose')

class Database {
	constructor() {
		this._connect()
	}

	_connect() {
		mongoose
			.connect(
				`${process.env.MONGO_URL}/${process.env.DB_NAME}`,
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
				console.log(err)
				console.log('Kết nối tới cơ sở dữ liệu thất bại!')
			})

	}
}

module.exports = new Database();