<template>
	<view class="home">
		<up-loading-page :loading="loading"></up-loading-page>
		<up-sticky bgColor="#fff" v-if="!loading">
			<up-subsection :list="tabList" :current="activeIndex" @change="handleTabChange" bgColor="#fff"
				activeColor="#3c9cff"></up-subsection>
			<up-line color="#3c9cff"></up-line>
		</up-sticky>
		<view class="component_box" v-if="!loading">
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
		onMounted
	} from 'vue';
	import BlueToothVue from '@/pages/bluetooth/index.vue'
	import MusicControll from '@/pages/musiccontroll/index.vue'
	import MicControll from '@/pages/miccontroll/index.vue'
	import EffectControll from '@/pages/effectcontroll/index.vue'

	import {
		useTabStore
	} from '@/stores/tarData'
	import {
		storeToRefs
	} from 'pinia'

	const components = reactive([
		markRaw(MusicControll), // ✅ 阻止深度代理[3,7](@ref)
		markRaw(MicControll), // ✅ 阻止深度代理[3,7](@ref)
		markRaw(EffectControll), // ✅ 阻止深度代理[3,7](@ref)
	]);

	// Tab配置项
	const tabList = reactive([{
		name: 'Music控制台',
		component: MusicControll
	}, {
		name: 'Mic控制台',
		component: MicControll
	}, {
		name: 'Effect控制台',
		component: EffectControll
	}]);

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
	watch(bluetoothData, (val) => {
		if (val && val.deviceId) {
			showBlueT.value = false
		}
	})

	const loading = ref(true)
	onMounted(() => {
		setTimeout(() => {
			loading.value = false
		}, 2000)
	})
</script>

<style lang="scss" scoped>
	.home {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding-bottom: 20rpx;

		.component_box {
			flex: 1;
			display: flex;
			flex-direction: row;
			position: relative;
			width: 100%;
			// height: calc(100% - 110rpx);

			.component {
				position: absolute;
				top: 0%;
				left: 0%;
				width: 100%;
				height: 100%;
				padding: 20rpx;
				box-sizing: border-box;
				transition-duration: .333s;
			}
		}
	}
</style>