export default {
	install(Vue, options) {
		Vue.mixin({
			methods: {
				$toast(message, type, customOption = null) {
					let options = {
						toast: true,
						timerProgressBar: true,
						position: 'top-end',
						icon: type,
						title: message,
						showConfirmButton: false,
						timer: 1500,
						didOpen: (toast) => {
							toast.addEventListener('mouseenter', Vue.swal.stopTimer)
							toast.addEventListener('mouseleave', Vue.swal.resumeTimer)
						},
						showClass: {
							popup: 'swal2-noanimation',
							backdrop: 'swal2-noanimation'
						},
						hideClass: {
							popup: '',
							backdrop: ''
						}
					}

					Object.assign(options, ...customOption)
					Vue.swal.fire(options)
				},
			}
		})
	}
}