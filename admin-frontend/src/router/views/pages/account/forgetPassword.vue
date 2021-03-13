<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

export default {
	page: {
		title: 'Forget Password',
		meta: [
			{ name: 'description', content: `Forget Password to ${appConfig.title}` },
		],
	},
	components: { Layout },
	data() {
		return {
			email: '',
			error: null,
			tryingToReset: false,
			isResetError: false,
			isSuccess: false,
			successMessage: null,
		}
	},
	computed: {},
	methods: {
		...authMethods,
		// Try to register the user in with the email, fullname
		// and password they provided.
		tryToReset() {
			this.tryingToReset = true
			// Reset the authError if it existed.
			this.error = null
			return this.resetPassword({
				email: this.email,
			})
				.then((data) => {
					this.tryingToReset = false
					this.isResetError = false
					this.isSuccess = true
					this.successMessage = data.message
				})
				.catch((error) => {
					this.tryingToReset = false
					this.error = error ? error.response.data.message : ''
					this.isResetError = true
					this.isSuccess = false
				})
		},
	},
}
</script>

<template>
	<Layout>
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-xl-10">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-6 p-5">
										<div class="mx-auto mb-5">
											<a href="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo"
													>LOCIFA</h3
												>
											</a>
										</div>

										<h6 class="h5 mb-0 mt-4">Khôi phục mật khẩu</h6>
										<p class="text-muted mt-1 mb-5"
											>Nhập địa chỉ mail của bạn và chúng tôi sẽ gửi một email kèm hướng dẫn thay đổi mật khẩu cho bạn.</p
										>

										<b-alert
											v-model="isResetError"
											variant="danger"
											dismissible
											>{{ error }}</b-alert
										>

										<b-alert
											v-model="isSuccess"
											variant="success"
											dismissible
											>{{ successMessage }}</b-alert
										>
										<form
											action="#"
											class="authentication-form"
											@submit.prevent="tryToReset"
										>
											<div class="form-group">
												<label class="form-control-label">Email</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="mail" class="icon-dual"></feather>
														</span>
													</div>
													<input
														id="email"
														v-model="email"
														type="email"
														class="form-control"
														placeholder="contact@locifa.com"
													/>
												</div>
											</div>

											<div class="form-group mb-0 text-center">
												<button class="btn btn-primary btn-block" type="submit"
													>Xác nhận</button
												>
											</div>
										</form>
									</div>
									<div class="col-lg-6 d-none d-md-inline-block">
										<div class="auth-page-sidebar">
											<div class="overlay"></div>
											<div class="auth-user-testimonial">
												<p class="font-size-24 font-weight-bold text-white mb-1"
													>I simply like it!</p
												>
												<p class="lead"
													>"Lao động hăng say, vận may sẽ đến!"</p
												>
												<p>- Quản trị viên</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- end card-body -->
						</div>
						<!-- end card -->

						<div class="row mt-3">
							<div class="col-12 text-center">
								<p class="text-muted">
									Quay lại trang
									<router-link
										tag="a"
										to="/login"
										class="text-primary font-weight-bold ml-1"
										>Đăng nhập</router-link
									>
								</p>
							</div>
							<!-- end col -->
						</div>
						<!-- end row -->
					</div>
					<!-- end col -->
				</div>
				<!-- end row -->
			</div>
			<!-- end container -->
		</div>
	</Layout>
</template>

<style lang="scss" module></style>
