<template>
	<view class="ctrol_box" ref="musicControll">
		<view class="eq_model">
			<Title title="EQ MODE" />
			<view class="padding_tb">
				<up-subsection :list="tabList" :current="activeIndex" @change="handleTabChange" bgColor="#f5f5f5"
					activeColor="#3c9cff" mode="subsection" fontSize="10"></up-subsection>
			</view>
		</view>

		<MusicChart class="eq_box" />

		<!-- 		<view class="eq_box">
			<Title title="MUSIC EQ"/>
			<view class="eq_padding">
			<view>
				<text class="word">TREB</text>
				<slider value="50" @changing="sliderChange" block-size="20" block-color=" #3c9cff" show-value />
			</view>
			<view>
				<text class="word">MID</text>
				<slider value="50" @changing="sliderChange" block-size="20" block-color=" #3c9cff" show-value />
			</view>
			<view>
				<text class="word">BASS</text>
				<slider value="50" @changing="sliderChange" block-size="20" block-color=" #3c9cff" show-value />
			</view>
			</view>
		</view> -->


		<PlayerVue class="play_box" word="VOL" sliderId="sliderIdMUISC" titlename="MUSIC" />

		<view class="common_box">
			<Title title="COMMON FUNC" />
			<view class="btn_container">
				<view class="btn_group">
					<button class="btn blue">{{ $translate("INPUT") }}</button>
					<button class="btn green">{{ $translate("MUTE") }}</button>
				</view>
			</view>
		</view>

		<up-toast ref="uToastRef"></up-toast>
	</view>
</template>
​
<script setup name="MusicControll">
	import PlayerVue from '@/component/player/index.vue'
	import MusicChart from '@/component/eqchart/musicchart.vue'
	import Title from '@/component/title/index.vue'
	import {
		ref,
		reactive,
		watch,
		markRaw,
		provide,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		useTabStore
	} from '@/stores/tarData'
	import {
		storeToRefs
	} from 'pinia'

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;

	const components = reactive([
		markRaw(PlayerVue),
		markRaw(MusicChart),
		markRaw(Title),
	]);

	const uToastRef = ref(null)
	// 将 ref 暴露给子组件（通过 provide 或 props）
	provide('fatherRef', {
		uToastRef
	});

	const tabStore = useTabStore()
	const activeIndex = ref(0)
	const tabList = [{
		name: $translate("CLASSICAL"),
		num: 0,
	}, {
		name: $translate("JAZZ"),
		num: 1,
	}, {
		name: $translate("POP"),
		num: 2,
	}, {
		name: $translate("ROCK"),
		num: 3,
	}, {
		name: $translate("VOCALS"),
		num: 4,
	}];
	// 切换Tab回调
	const handleTabChange = (index) => {
		activeIndex.value = index;
		// sendMessage写在这里
	};
</script>

<style lang="scss" scoped>
	@import "@/static/scss/controll.scss";

	.padding_tb {
		padding: 20rpx 0;
	}

	// .eq_padding {
	// 	padding-top: 50rpx;
	// }

	.common_box {
		margin-top: 20rpx;
		padding: 20rpx 0 0 20rpx;
		border-radius: 30rpx;
		background-color: #fff;
		box-sizing: border-box;

		.btn_container {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-top: 20rpx;
			padding-bottom: 20rpx;

			.btn_group {
				display: flex;
				gap: 20px;
				/* 按钮间距 */
			}

			.btn {
				font-size: 24rpx;
				width: 180rpx;
			}

			.blue {
				border: 1rpx solid #3c9cff;
				color: #3c9cff;
				background: none;
			}

			.green {
				background: none;
				border: 1rpx solid #5ac725;
				color: #5ac725;
			}
		}
	}
</style>