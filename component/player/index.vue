<template>
	<view class="play_box">
		<Title v-if="titlename" :title="titlename" class="title" />
		<view class="slider_box">
			<text class="word" v-if="word">{{ $translate(word) }} </text>
			<view class="button" v-if="!showButton && showIcon">
				<up-icon @tap="voiceHandler(-1)" v-show="voice > 15" :name="volume2Png" color="#9c9c9c"
					size="20"></up-icon>
				<up-icon @tap="voiceHandler(-1)" v-show="voice > 0 && voice <= 15" :name="volume1Png" color="#9c9c9c"
					size="20"></up-icon>
				<up-icon @tap="voiceHandler(101)" v-show="voice <= 0" :name="volumeXPng" color="#9c9c9c"
					size="20"></up-icon>
			</view>
			<up-slider class="slider" :min="0" :max="30" v-model="voice" activeColor="#3c9cff" inactiveColor="#c0c4cc"
				blockSize="24" blockColor="#3c9cff"></up-slider>
			<text class="word vioce">{{ voice }} </text>
		</view>
		<view class="bottom" v-if="showButton">
			<view class="button" @tap.stop="cutSchema">
				<up-icon :name="schemaSource[schemaIndex].name" size="20"></up-icon>
			</view>
			<view class="button button2" @tap.stop="playHandler('pre')">
				<up-icon :name="rewindLeftFillPng" color="#9c9c9c" size="28"></up-icon>
			</view>
			<view class="button button3" @tap.stop="playHandler('play')">
				<up-icon v-show="playing" :name="pauseCircleFillPng" color="#9c9c9c" size="42"></up-icon>
				<up-icon v-show="!playing" :name="playCircleFillPng" color="#9c9c9c" size="42"></up-icon>
			</view>
			<view class="button button2" @tap.stop="playHandler('next')">
				<up-icon :name="rewindRightFillPng" color="#9c9c9c" size="28"></up-icon>
			</view>
			<view class="button">
				<up-icon @tap="voiceHandler(-1)" v-show="voice > 15" :name="volume2Png" color="#9c9c9c"
					size="20"></up-icon>
				<up-icon @tap="voiceHandler(-1)" v-show="voice > 0 && voice <= 15" :name="volume1Png" color="#9c9c9c"
					size="20"></up-icon>
				<up-icon @tap="voiceHandler(101)" v-show="voice <= 0" :name="volumeXPng" color="#9c9c9c"
					size="20"></up-icon>
			</view>
		</view>
	</view>

</template>
​
<script setup name="Play">
	import {
		ref,
		reactive,
		watch,
		inject,
		markRaw,
		provide,
		getCurrentInstance
	} from 'vue'

	import {
		storeToRefs
	} from 'pinia'

	import circulPng from '@/static/img/circul.png'
	import orderPng from '@/static/img/order.png'
	import randomPng from '@/static/img/random.png'

	import rewindLeftFillPng from '@/static/img/rewind-left-fill.png'
	import pauseCircleFillPng from '@/static/img/pause-circle-fill.png'
	import playCircleFillPng from '@/static/img/play-circle-fill.png'
	import rewindRightFillPng from '@/static/img/rewind-right-fill.png'
	import volumeXPng from '@/static/img/volume-x.png'
	import volume2Png from '@/static/img/volume-2.png'
	import volume1Png from '@/static/img/volume-1.png'

	import Title from '@/component/title/index.vue'

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;

	const props = defineProps({
		showButton: {
			type: Boolean,
			default: true
		},
		word: {
			type: String,
			default: ""
		},
		showIcon: {
			type: Boolean,
			default: true
		},
		sliderId: {
			type: String,
			default: "sliderRowId"
		},
		titlename: {
			type: String,
			default: ""
		}
	})

	/* *** 
		从父组件注入 refs 对象
		访问兄弟组件 uToastRef 的实例
	*** */
	const fatherRef = inject('fatherRef');

	/* ***
	
	 切换播放模式
	 schemaIndex: 
	 1 - 顺序模式
	 2 - 单曲模式
	 3 - 随机模式
	 
	*** */
	const schemaIndex = ref(0)
	const schemaSource = [{
		name: orderPng,
		str: "顺序模式"
	}, {
		name: circulPng,
		str: "单曲模式"
	}, {
		name: randomPng,
		str: "随机模式"
	}]
	const cutSchema = () => {
		if (schemaIndex.value === 2) {
			schemaIndex.value = 0
		} else {
			schemaIndex.value++
		}
		fatherRef.uToastRef.value.show({
			position: 'top',
			message: `已切换到${schemaSource[schemaIndex.value].str}`
		})
	}

	/* ***
	
	 切换播放 / 暂停
	 
	*** */
	const playing = ref(false)
	const playHandler = (str) => {
		switch (str) {
			case 'play':
				playing.value = !playing.value;
				break;
			case 'pre':
				break;
			case 'next':
				break;
		}
	}

	/* ***
	
	 滑动声音
	 
	*** */
	const voice = ref(100)
	const voiceCache = ref(voice.value)
	const voiceHandler = (data) => {
		if (data == -1) {
			voiceCache.value = voice.value
			voice.value = 0
		} else if (data == 101) {
			voice.value = voiceCache.value
		} else {
			voice.value = data
		}

		// 根据 sliderId 触发sendMessage
	}
	provide('voiceHandler', voiceHandler);
</script>

<style lang="scss" scoped>
	.play_box {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;

		.title {
			padding: 20rpx 0;
		}

		.slider_box {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0rpx 10rpx;
			box-sizing: border-box;

			.word {
				display: inline-block;
				text-align: center;
				font-size: 24rpx;
				color: #9c9c9c;
			}

			.vioce {
				color: #3c9cff;
				text-shadow: 0 0 3rpx #9c9c9c;
			}

			.slider {
				flex: 1;
			}
		}

		.bottom {
			width: 100%;
			display: flex;
			flex-direction: row;
			box-sizing: border-box;

			.button {
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
			}

			.button2 {
				flex: 1.5;
			}

			.button3 {
				flex: 2;
			}
		}
	}
</style>