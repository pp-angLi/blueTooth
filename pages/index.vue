<template>
	<up-loading-page :loading="loading"></up-loading-page>
	<view class="home" v-if="!loading">
		<view class="top">
			<view class="btn_box">
				<!-- 				<up-icon :name="btClosePng" color="#9c9c9c"
					size="28"></up-icon>
				<up-icon :name="btOpenPng" color="#9c9c9c"
					size="28"></up-icon> -->
				<up-icon @tap="translatHandler" :name="translationPng" color="#9c9c9c" size="28"></up-icon>
			</view>
			<up-subsection :list="tabList" :current="activeIndex" @change="handleTabChange" bgColor="#fff"
				activeColor="#3c9cff"></up-subsection>
			<up-line color="#3c9cff"></up-line>
		</view>
		<view class="component_box">
			<view class="component" v-if="activeIndex === 0">
				<MusicControll />
			</view>
			<view class="component" v-if="activeIndex === 1">
				<MicControll />
			</view>
			<view class="component" v-if="activeIndex === 2">
				<EffectControll />
			</view>
		</view>
		<!-- <BlueToothVue v-show="showBlueT" /> -->
	</view>
</template>

<script setup>
	import {
		ref,
		markRaw,
		reactive,
		watch,
		onMounted,
		getCurrentInstance
	} from 'vue';
	import BlueToothVue from '@/pages/bluetooth/index.vue'
	import MusicControll from '@/pages/musiccontroll/index.vue'
	import MicControll from '@/pages/miccontroll/index.vue'
	import EffectControll from '@/pages/effectcontroll/index.vue'

	import btClosePng from '@/static/img/bluetoothclose.png'
	import btOpenPng from '@/static/img/bluetoothopen.png'
	import translationPng from '@/static/img/translation.png'


	import {
		useTabStore
	} from '@/stores/tarData'
	import {
		storeToRefs
	} from 'pinia'

	const instance = getCurrentInstance();
	const $translate = instance.appContext.config.globalProperties.$translate;

	// 引入组件
	const components = reactive([
		markRaw(MusicControll), // ✅ 阻止深度代理[3,7](@ref)
		markRaw(MicControll), // ✅ 阻止深度代理[3,7](@ref)
		markRaw(EffectControll), // ✅ 阻止深度代理[3,7](@ref)
	]);

	// Tab配置项

	const setTabList = () => {
		return reactive([{
			name: $translate('MUSIC CTRL'),
			component: MusicControll
		}, {
			name: $translate('MIC CTRL'),
			component: MicControll
		}, {
			name: $translate('EFFECT CTRL'),
			component: EffectControll
		}]);
	}
	let tabList = setTabList()

	const activeIndex = ref(0);

	// 切换Tab回调
	const handleTabChange = (index) => {
		activeIndex.value = index;
	};

	const tabStore = useTabStore()
	const {
		bluetoothData
	} = storeToRefs(tabStore) // 解构保持响应式
	const showBlueT = ref(true)
	// 监听蓝牙是否打开，打开则关闭弹窗
	watch(bluetoothData, (val) => {
		if (val && val.deviceId) {
			showBlueT.value = false
		}
	})

	const loading = ref(false)

	// 切换翻译语种
	const translatHandler = () => {
		const locale = uni.getStorageSync('locale') || uni.getSystemInfoSync().language;
		if (locale === "zh-CN" || locale === "zh-Hans") {
			uni.setStorageSync('locale', "en")
		} else {
			uni.setStorageSync('locale', "zh-CN")
		}
		loading.value = true
		setTimeout(() => {
			tabList = setTabList()
			loading.value = false
		}, 333)
	}
</script>

<style lang="scss" scoped>
	.home {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding-bottom: 5rpx;
		box-sizing: border-box;

		.top {
			width: 100%;
			padding-top: 80rpx;
			box-sizing: border-box;
			background-color: #fff;

			.btn_box {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				padding-right: 30rpx;
				box-sizing: border-box;
			}

			// height: 200rpx;
		}

		.component_box {
			flex: 1;
			display: flex;
			flex-direction: row;
			position: relative;
			width: 100%;
			box-sizing: border-box;

			.component {
				position: absolute;
				top: 0%;
				left: 0%;
				width: 100%;
				height: 100%;
				padding: 20rpx;
				box-sizing: border-box;
			}
		}
	}
</style>