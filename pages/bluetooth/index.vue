<template>
	<view class="blue_tooth">
		<view>
			<up-modal :show="showConfirm" @confirm="confirm" ref="uModal" content="检测到您未打开蓝牙，本应用需打开蓝牙功能才可体验，请打开蓝牙功能。"
				confirmText="打卡蓝牙"></up-modal>
		</view>

		<view class="box" v-show="isOpenBlueT">
			<text class="box_title">请选择需要连接的蓝牙设备</text>
			<view class="scroll_box">
				<scroll-view scroll-y class="scroll">
					<view class="item" v-for="(item, index) in bluetooth.blueDeviceList"
						@tap.stop="bluetooth.connectHandler(item, index, connectControl)" :key="index">
						<text>{{ item.name }}</text>
						<text class="connecting" v-if="connectIndex == index"> 正在连接... </text>
					</view>
				</scroll-view>
			</view>
		</view>


		<!-- 		<button @click="bluetooth.initBlueT">1 初始化蓝牙</button>

		<button @click="bluetooth.disBlueT">2 搜索附近蓝牙设备</button> -->

		<!--      <button @click="getServices">3 获取蓝牙服务</button>
        
        <button @click="getCharacteristics">4 获取特征值</button> -->

		<!-- <button @click="notify">5 开启消息监听</button> -->

		<view class="blue-name" v-show="false">
			<!-- 消息显示区域 -->
			<div class="input-title">请输入蓝牙名</div>
			<div class="input-area">
				<input type="text" v-model="bluetooth.inputMessage" @keyup.enter="bluetooth.sendBlueTName"
					placeholder="输入要修改的蓝牙名...">
			</div>
			<button @click="bluetooth.notify">修改蓝牙名</button>
		</view>


		<!--        <button @click="sendHex">6 发送数据</button>
        
        <button @click="read">7 读取数据</button> -->

		<!--  <view class="msg_x">
            <view class="msg_txt">
                监听到的内容：{{ message }}
            </view>
            <view class="msg_hex">
                监听到的内容（十六进制）：{{ messageHex }}
            </view> 
        </view> -->
	</view>
</template>

<script setup name="BlueToothVue">
	import {
		ref,
		onUnmounted
	} from 'vue'
	import BlueTooth from '@/pages/bluetooth/blueTooth.js'
	import {
		onShow
	} from '@dcloudio/uni-app';

	// 控制器显示flag
	const showConfirm = ref(false)

	// 弹出控制器
	const openConfirm = () => {
		showConfirm.value = true
	}

	let timeoutId

	// 从stroge中获取缓存数据
	const blueDeviceList = (uni.getStorageSync('blueDeviceList') && JSON.parse(uni.getStorageSync('blueDeviceList'))) ||
	[];
	// 蓝牙功能类
	const bluetooth = new BlueTooth({
		openConfirm,
		timeoutId,
		blueDeviceList
	})

	// 加载动画
	const loadingWord = "检查是否打开蓝牙......"
	const loadingWords = loadingWord.split("")

	// 是否已经打开蓝牙
	const isOpenBlueT = ref(false)
	// 是否在外部打开蓝牙的步骤。
	const blueTStep = ref(false)

	// 已经打开蓝牙功能后，执行
	const openBlueTHandler = (flag) => {
		isOpenBlueT.value = flag
		if (flag) {
			bluetooth.disBlueT()
			showConfirm.value = false

			uni.onBluetoothAdapterStateChange((res) => {
				console.log('蓝牙适配器状态变化', res);
				if (!res.available) {
					showConfirm.value = true
					isOpenBlueT.value = false
					// 蓝牙开关被关闭
				} else {
					// 蓝牙已打开，可以执行相关操作，比如重新连接设备等
					console.log('蓝牙已打开');
				}
			});
		}
	}

	// 【1】默认调起蓝牙检测
	bluetooth.initBlueT(openBlueTHandler)

	// 【退出APP后回来】脱离页面后回来。
	onShow(() => {
		if (blueTStep.value) {
			bluetooth.checkBluetoothEnabled(openBlueTHandler)
		}
		blueTStep.value = false
		console.log("页面显示");
		// 典型场景：刷新数据、恢复动画
	});

	// 退出当前页面时销毁
	onUnmounted(() => {
		clearTimeout(timeoutId);
		uni.setStorageSync('blueDeviceList', JSON.stringify(bluetooth.blueDeviceList));
	})

	// 【click】点击"打开蓝牙"
	const confirm = async () => {
		const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter');
		const blueAdapter = BluetoothAdapter.getDefaultAdapter();

		if (blueAdapter && !blueAdapter.isEnabled()) {
			// 直接启用蓝牙（无弹窗提示）
			blueAdapter.enable();
			blueTStep.value = true
		}
	}

	// 哪个蓝牙正在连接
	const connectIndex = ref(-1)
	const connectControl = (index) => {
		connectIndex.value = index
	}
</script>

<style lang="scss" scoped>
	.blue_tooth {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		text-align: center;
		z-index: 9;
	}

	.box {
		position: absolute;
		width: 90%;
		height: 65%;
		top: 40%;
		left: 50%;
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: #7f7f7f;
		border-radius: 40rpx;
		transform: translate(-50%, -50%);
		color: #fff;
		text-align: left;

		.box_title {
			display: inline-block;
			padding: 40rpx 0;
			color: #ccc;
			font-size: 26rpx;
		}

		.scroll_box {
			height: calc(100% - 250rpx);
			padding-bottom: 20rpx;
			border-radius: 20rpx;
			background-color: rgba(255, 255, 255, 0.1);
			box-sizing: border-box;

			.scroll {
				height: 100%;

				.item {
					font-size: 26rpx;
					font-weight: bold;
					word-break: keep-all;
					padding: 30rpx;

					.connecting {
						display: block;
						color: #ccc;
						font-size: 24rpx;
						font-weight: 400rpx;
					}
				}
			}
		}

	}

	button {
		margin-bottom: 20rpx;
	}

	.input-title {
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.input-area {
		width: 98%;
		height: 60rpx;
		margin: 10rpx;
		border: 1px solid;
	}
</style>