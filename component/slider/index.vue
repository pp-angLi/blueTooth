<template>
	<view class="slider" @touchstart.stop.prevent="touchStartHandler" @touchmove.stop.prevent="touchMoveHandler"
		:id="sliderId">
		<view class="slider_line"></view>
		<view class="slider_line slider_background" :style="{
			height: top
		}"></view>
		<view class="slider_circul" :class="disabled ? 'slider_dis' : ''" :style="{
			top
		}">
<!-- 			<text class="number">
				{{ value + min }}
			</text> -->
		</view>
	</view>
</template>

<script setup name="Slider">
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref
	} from 'vue';

	import {
		extractPercentToDecimal
	} from '@/utils/utils.js'

	const props = defineProps({
		disabled: false,
		value: undefined,
		max: {
			type: Number,
			default: 100
		},
		min: {
			type: Number,
			default: 0
		},
		sliderId: {
			type: String,
			default: 'sliderId'
		},
		onSliderChange: {
			type: Function,
			default: () => {}
		}
	})

	const dom = reactive({
		top: 0,
		height: 0
	})
	onMounted(async () => {
		await nextTick()
		const query = uni.createSelectorQuery().in(this)
		setTimeout(() => {
			query.select(`#${props.sliderId}`).boundingClientRect(rect => {
				if (rect) {
					dom.top = rect.top
					dom.height = rect.height
				}
			}).exec();
			console.log(dom)
		}, 2000)
	})
	let computeTopPecent = 0
	if (props.value === 0 || props.value) {
		let computeTop = props.value
		computeTop = computeTop >= props.max ? props.max : computeTop <= 0 ? 0 : computeTop
		computeTopPecent = 1 - (computeTop / props.max)
		computeTopPecent = computeTopPecent * 100
	}
	const top = ref(`${computeTopPecent}%`)

	// 计算移动了多少距离
	const comPosition = (pageY) => {
		if (props.disabled) {
			return
		}
		let value = ((pageY - dom.top) / dom.height) * 100
		if (value >= 100) {
			value = 100
		} else if (value <= 0) {
			value = 0
		}
		return Math.round(value)
	}

	// 把移动的距离显示到屏幕上
	const moveHandler = (value) => {
		const newValue = props.max - Math.round((value / 100) * props.max)
		if (newValue === props.value) {
			return
		}
		top.value = `${Math.round((1 - (newValue / props.max)) * 100)}%`
		props.onSliderChange(newValue, props.sliderId)
	}

	// 拖拉开始时间
	let canMove = false
	const touchStartHandler = (e) => {
		const {
			pageY
		} = e.touches[0]
		const value = comPosition(pageY)
		const nowLeft = extractPercentToDecimal(top.value)
		const dif = value - nowLeft
		if (value - nowLeft > 10 || value - nowLeft < -10) {
			canMove = false
		} else {
			canMove = true
		}
	}

	const touchMoveHandler = (e) => {
		const {
			pageY
		} = e.touches[0]
		// if (canMove) {
		// 	moveHandler(comPosition(pageY))
		// }
		moveHandler(comPosition(pageY))
	}
</script>

<style lang="scss" scoped>
	.slider {
		position: relative;
		height: 100%;

		.slider_line {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			height: 100%;
			width: 8rpx;
			background-color: #3c9cff;
			border-radius: 100rpx;
		}

		.slider_background {
			background-color: #fff;
		}

		.slider_circul {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background-color: #3c9cff;
			box-shadow: 0 0 5rpx black;

			.number {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 20rpx;
				color: #fff;
				text-shadow: 0 0 3rpx #3c9cff;
			}
		}

		.slider_dis {
			background-color: #9c9c9c;
		}
	}
</style>