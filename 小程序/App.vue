<script>
	export default {
		onLaunch: function() {
			// uni.removeStorage({
			// 	key:'authKey'
			// })
			// 微信授权 登录操作
			this.$store.dispatch('initUser')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/common/common.css";
    @import "/common/main.css";
	@import "/common/statisticsArea.scss";
</style>
