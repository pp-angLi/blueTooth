<template>
	<view class="ctrol_box" ref="musicControll">
		<EffectChart class="eq_box" />

		<PlayerVue class="play_box" :showButton="false" sliderId="sliderIdE" />

		<up-toast ref="uToastRef"></up-toast>
	</view>
</template>
​
<script setup name="EffectControll">
	import PlayerVue from '@/component/player/index.vue'
	import EffectChart from '@/component/eqchart/effectchart.vue'
	import Title from '@/component/title/index.vue'
	import {
		ref,
		reactive,
		watch,
		markRaw,
		provide
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import BlueTooth from '@/pages/bluetooth/blueTooth.js'
	import {
		useTabStore
	} from '@/stores/tarData'
	import {
		storeToRefs
	} from 'pinia'

	const components = reactive([
		markRaw(PlayerVue),
		markRaw(EffectChart),
		markRaw(Title),
	]);

	const uToastRef = ref(null)
	// 将 ref 暴露给子组件（通过 provide 或 props）
	provide('fatherRef', {
		uToastRef
	});

	const tabStore = useTabStore()
	const {
		bluetoothData
	} = storeToRefs(tabStore) // 解构保持响应式

	/* ****
	
	 监听特征值
	 
	**** */
	let bluetooth = reactive({})
	watch(bluetoothData, (val) => {
		if (val.serviceIds.length) {
			bluetooth = new BlueTooth(val)
			bluetooth.getCharacteristics()
		} else {
			uni.showToast({
				title: '无法获取特征值！',
				icon: 'error'
			})
		}
	})

	const activeIndex = ref(0)
	const tabList = [{
		name: '古典',
		num: 0,
	}, {
		name: '爵士',
		num: 1,
	}, {
		name: '流行',
		num: 2,
	}, {
		name: '摇滚',
		num: 3,
	}, {
		name: '人声',
		num: 4,
	}];
	// 切换Tab回调
	const handleTabChange = (index) => {
		activeIndex.value = index;
		// sendMessage写在这里
	};

	/***************************************************************************************/
	// MIC VOL
	// 在组件外部定义状态控制变量
	let micVolLatestValue = null; // 记录最后一次需要发送的值
	let micVolIsSending = false; // 标记是否正在发送
	let micVolRetryTimer = null; // 追踪重试定时器ID

	function micVolSliderChange(e) {
		const newValue = e.detail.value;

		// 只有新值变化时才更新 micVolLatestValue
		if (newValue !== micVolLatestValue) {
			micVolLatestValue = newValue;
			// 触发发送（如果当前没有发送任务）
			if (!micVolIsSending) {
				micVolSendWithRetry();
			}
		}
	}

	// 核心发送逻辑（自动重试直到成功）
	function micVolSendWithRetry() {
		if (micVolLatestValue === null) return;

		const valueToSend = micVolLatestValue;
		micVolIsSending = true;

		// 构造数据
		const msg = String(valueToSend).padEnd(4, ' ');
		const buffer = new ArrayBuffer(4);
		const dataView = new DataView(buffer);
		for (let i = 0; i < 4; i++) {
			dataView.setUint8(i, msg[i].charCodeAt(0));
		}

		// 清除之前的重试定时器（如果有）
		if (micVolRetryTimer) {
			clearTimeout(micVolRetryTimer);
			micVolRetryTimer = null;
		}

		uni.writeBLECharacteristicValue({
			deviceId: deviceId.value,
			serviceId: serviceId.value[0], //0是micVol
			characteristicId: characteristicId.value[0], //0是micVol
			value: buffer,
			success: () => {
				console.log('✅ 发送成功:', valueToSend);
				micVolIsSending = false;

				// 清除所有待处理的重试定时器
				if (micVolRetryTimer) {
					clearTimeout(micVolRetryTimer);
					micVolRetryTimer = null;
				}

				// 如果发送成功后又有新值到达，立即发送
				if (micVolLatestValue !== null && micVolLatestValue !== valueToSend) {
					micVolSendWithRetry();
				}
			},
			fail: (err) => {
				console.error('❌ 发送失败:', err);
				micVolIsSending = false;

				// 设置新的重试定时器（300ms后重试）
				micVolRetryTimer = setTimeout(() => {
					micVolSendWithRetry();
				}, 100);
			}
		});
	}
	/***************************************************************************************/


	/***************************************************************************************/
	// REVERB VOL
	// 在组件外部定义状态控制变量
	let reverbVolLatestValue = null; // 记录最后一次需要发送的值
	let reverbVolIsSending = false; // 标记是否正在发送
	let reverbVolRetryTimer = null; // 追踪重试定时器ID

	function reverbVolSliderChange(e) {
		const newValue = e.detail.value;

		// 只有新值变化时才更新 reverbVolLatestValue
		if (newValue !== reverbVolLatestValue) {
			reverbVolLatestValue = newValue;
			// 触发发送（如果当前没有发送任务）
			if (!reverbVolIsSending) {
				reverbVolSendWithRetry();
			}
		}
	}

	// 核心发送逻辑（自动重试直到成功）
	function reverbVolSendWithRetry() {
		if (reverbVolLatestValue === null) return;

		const valueToSend = reverbVolLatestValue;
		reverbVolIsSending = true;

		// 构造数据
		const msg = String(valueToSend).padEnd(4, ' ');
		const buffer = new ArrayBuffer(4);
		const dataView = new DataView(buffer);
		for (let i = 0; i < 4; i++) {
			dataView.setUint8(i, msg[i].charCodeAt(0));
		}

		// 清除之前的重试定时器（如果有）
		if (reverbVolRetryTimer) {
			clearTimeout(reverbVolRetryTimer);
			reverbVolRetryTimer = null;
		}

		uni.writeBLECharacteristicValue({
			deviceId: deviceId.value,
			serviceId: serviceId.value[1], //0是micVol
			characteristicId: characteristicId.value[1], //0是micVol
			value: buffer,
			success: () => {
				console.log('✅ 发送成功:', valueToSend);
				reverbVolIsSending = false;

				// 清除所有待处理的重试定时器
				if (reverbVolRetryTimer) {
					clearTimeout(reverbVolRetryTimer);
					reverbVolRetryTimer = null;
				}

				// 如果发送成功后又有新值到达，立即发送
				if (reverbVolLatestValue !== null && reverbVolLatestValue !== valueToSend) {
					reverbVolSendWithRetry();
				}
			},
			fail: (err) => {
				console.error('❌ 发送失败:', err);
				reverbVolIsSending = false;

				// 设置新的重试定时器（300ms后重试）
				reverbVolRetryTimer = setTimeout(() => {
					reverbVolSendWithRetry();
				}, 100);
			}
		});
	}
	/***************************************************************************************/

	/***************************************************************************************/
	// ECHO VOL
	// 在组件外部定义状态控制变量
	let echoVolLatestValue = null; // 记录最后一次需要发送的值
	let echoVolIsSending = false; // 标记是否正在发送
	let echobVolRetryTimer = null; // 追踪重试定时器ID

	function echoVolSliderChange(e) {
		const newValue = e.detail.value;

		// 只有新值变化时才更新 echoVolLatestValue
		if (newValue !== echoVolLatestValue) {
			echoVolLatestValue = newValue;
			// 触发发送（如果当前没有发送任务）
			if (!echoVolIsSending) {
				echobVolSendWithRetry();
			}
		}
	}

	// 核心发送逻辑（自动重试直到成功）
	function echobVolSendWithRetry() {
		if (echoVolLatestValue === null) return;

		const valueToSend = echoVolLatestValue;
		echoVolIsSending = true;

		// 构造数据
		const msg = String(valueToSend).padEnd(4, ' ');
		const buffer = new ArrayBuffer(4);
		const dataView = new DataView(buffer);
		for (let i = 0; i < 4; i++) {
			dataView.setUint8(i, msg[i].charCodeAt(0));
		}

		// 清除之前的重试定时器（如果有）
		if (echobVolRetryTimer) {
			clearTimeout(echobVolRetryTimer);
			echobVolRetryTimer = null;
		}

		uni.writeBLECharacteristicValue({
			deviceId: deviceId.value,
			serviceId: serviceId.value[1], //一共只有两个服务
			characteristicId: characteristicId.value[2], //2是echoVol
			value: buffer,
			success: () => {
				console.log('✅ 发送成功:', valueToSend);
				echoVolIsSending = false;

				// 清除所有待处理的重试定时器
				if (echobVolRetryTimer) {
					clearTimeout(echobVolRetryTimer);
					echobVolRetryTimer = null;
				}

				// 如果发送成功后又有新值到达，立即发送
				if (echoVolLatestValue !== null && echoVolLatestValue !== valueToSend) {
					echobVolSendWithRetry();
				}
			},
			fail: (err) => {
				console.error('❌ 发送失败:', err);
				echoVolIsSending = false;

				// 设置新的重试定时器（300ms后重试）
				echobVolRetryTimer = setTimeout(() => {
					echobVolSendWithRetry();
				}, 100);
			}
		});
	}
</script>

<style lang="scss" scoped>
	@import "@/static/scss/controll.scss";
</style>