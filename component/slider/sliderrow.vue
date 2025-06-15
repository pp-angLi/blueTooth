<template>
	<view class="slider_row" @touchstart.stop.prevent="touchStartHandler" @touchmove.stop.prevent="touchMoveHandler"
		:id="sliderId">
		<view class="slider_line"></view>
		<view class="slider_line slider_background" :style="{
			width: left
		}"></view>
		<view class="slider_circul" :id="`${sliderId}-cir`" :class="disabled ? 'slider_dis' : ''" :style="{
			left
		}">
		</view>
	</view>
</template>

<script setup name="SliderRow">
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref,
		inject,
		watch
	} from 'vue';

	import {
		extractPercentToDecimal
	} from '@/utils/utils.js'

	const props = defineProps({
		disabled: false,
		value: 0,
		sliderId: {
			type: String,
			default: 'sliderId'
		},
		max: {
			type: Number,
			default: 100
		},
		min: {
			type: Number,
			default: 0
		},
	})

	const dom = reactive({
		left: 0,
		right: 0,
		height: 0
	})
	const setDom = (sliderId) => {
		const query = uni.createSelectorQuery().in(this)
		const qSliderId = `#${sliderId}`
		query.select(qSliderId).boundingClientRect(rect => {
			if (rect) {
				dom.left = rect.left
				dom.right = rect.right
				dom.width = rect.width
			}
		}).exec();
	}
	onMounted(async () => {
		await nextTick()
		setDom(props.sliderId)
	})
	const left = ref("0%")
	const computPropsValue = (val) => {
		let computePecent = 0
		if (val === 0 || val) {
			let compute = val
			compute = compute >= props.max ? props.max : compute <= 0 ? 0 : compute
			computePecent = compute / props.max
			computePecent = computePecent * 100
		}
		left.value = `${computePecent}%`
	}
	computPropsValue(props.value)

	const voiceHandler = inject('voiceHandler');
	const comPosition = (pageX) => {
		if (props.disabled) {
			return
		}
		let value = ((pageX - dom.left) / dom.width) * 100
		if (value >= 100) {
			value = 100
		} else if (value <= 0) {
			value = 0
		}
		return Math.round(value)
	}

	const moveHandler = (value) => {
		if (props.value === value) {
			return
		}
		left.value = `${value}%`
		voiceHandler(value)
	}

	// 触碰开始事件
	let canMove = false
	const touchStartHandler = (e) => {
		const {
			pageX
		} = e.touches[0]
		const value = comPosition(pageX)
		const nowLeft = extractPercentToDecimal(left.value)
		const dif = value - nowLeft
		if (value - nowLeft > 10 || value - nowLeft < -10) {
			canMove = false
		} else {
			canMove = true
		}
	}

	// 触碰释放事件
	const touchMoveHandler = (e) => {
		const {
			pageX
		} = e.touches[0]
		if (canMove) {
			moveHandler(comPosition(pageX))
		}
	}

	watch(() => props.value, (val) => {
		computPropsValue(val)
	})
</script>

<style lang="scss" scoped>
	.slider_row {
		position: relative;
		width: 100%;
		height: 40rpx;

		.slider_line {
			position: absolute;
			top: 50%;
			left: 0%;
			transform: translateY(-50%);
			height: 8rpx;
			width: 100%;
			background-color: #f3f3f3;
			border-radius: 100rpx;
		}

		.slider_background {
			background-color: #3c9cff;
		}

		.slider_circul {
			position: absolute;
			left: 0%;
			transform: translateX(-50%);
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background-color: #3c9cff;
			box-shadow: 0 0 5rpx black;
		}

		.slider_dis {
			background-color: #9c9c9c;
		}
	}
</style>