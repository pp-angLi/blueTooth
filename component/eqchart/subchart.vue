<template>
	<view class="charts">
		<!-- <CirsliderVue /> -->
		<view class="charts_top">
			<Title title="SUB" />
		</view>

		<view class="slider_row_box" v-for="slider in sliderRowList" :key="slider.sliderId">
			<text class="word word1">{{ slider.name }} </text>
			<up-slider class="slider" :min="0" :max="30" v-model="slider.value" activeColor="#3c9cff"
				inactiveColor="#c0c4cc" blockSize="18" blockColor="#3c9cff"></up-slider>
			<text class="word vioce">{{ slider.value }} </text>
		</view>
		<!-- 		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{ dBF - slider.value }}</view>
				<view class="slider">
					<pp-slider :vertical="true" :value="slider.value" :min="0" :max="dBF" @changing="slider.func"
						backgroundColor="#3c9cff" activeColor="#9c9c9c" blockColor="#3c9cff" />
				</view>
				<view class="word">{{ slider.name }}</view>
			</view>
		</view> -->
	</view>
</template>

<script setup name="SubChart">
	import Title from '@/component/title/index.vue'
	// import CirsliderVue from "@/component/slider/cirslider.vue"
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref,
		getCurrentInstance,
		watch
	} from 'vue';

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;
	const dBF = 30

	const components = reactive([
		markRaw(Title),
		// markRaw(CirsliderVue)
	]);

	// sendMessage写在这里
	const onSliderChange = (val, sliderId) => {
		const i = sliderList.findIndex(slider => slider.sliderId === sliderId)
		sliderList[i].value = val
	}

	// const sliderList = reactive([{
	// 	name: $translate("BASS"),
	// 	value: 0,
	// 	sliderId: "bass",
	// 	func: (val) => {
	// 		onSliderChange(val, "bass")
	// 	}
	// }, {
	// 	name: $translate("TREBLE"),
	// 	value: 0,
	// 	sliderId: "treble",
	// 	func: (val) => {
	// 		onSliderChange(val, "treble")
	// 	}
	// }])

	const sliderRowList = reactive([{
		name: $translate("FEQ"),
		sliderId: "feq",
		value: 0,
	}])
</script>

<style lang="scss" scoped>
	@import "@/static/scss/echartstyle.scss";

	.slider_row_box {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0rpx 10rpx;
		box-sizing: border-box;

		.word1 {
			text-align: right;
		}

		.word {
			display: inline-block;
			font-size: 24rpx;
			color: #9c9c9c;
		}

		.vioce {
			color: #3c9cff;
			text-shadow: 0 0 3rpx #9c9c9c;
		}

		.slider {
			flex: 1;
			overflow: hidden;
			padding-right: 20rpx;
			box-sizing: border-box;
		}
	}
</style>