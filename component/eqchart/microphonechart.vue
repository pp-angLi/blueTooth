<template>
	<view class="charts">
		<view class="charts_top">
			<Title title="麦克风" />
			<!-- 			<view class="word_box">
				<text class="word">100dB</text>
			</view> -->
		</view>
		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{ slider.value }}</view>
				<view class="slider">
					<SliderVue :disabled="slider.disabled" :value="slider.value" :sliderId="slider.sliderId"
						:onSliderChange="onSliderChange" :switchOpen="switchOpen" />
				</view>
				<view class="word">{{ slider.name }}</view>
			</view>
		</view>
		<!-- 		<view class="charts_bottom">
			<text class="word">0dB</text>
		</view> -->
	</view>
</template>

<script setup name="MicrophoneChart">
	import Title from '@/component/title/index.vue'
	import SliderVue from '@/component/slider/index.vue'
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref,
		watch,
	} from 'vue';

	const props = defineProps({
		switchOpen: {
			type: Boolean,
			default: true
		},
	})

	const components = reactive([
		markRaw(SliderVue),
		markRaw(Title),
	]);

	// sendMessage写在这里
	const onSliderChange = (val, sliderId) => {
		const i = sliderList.findIndex(slider => slider.sliderId === sliderId)
		sliderList[i].value = val
	}

	const sliderList = reactive([{
		name: '低',
		value: 0,
		sliderId: "low",
	}, {
		name: '中',
		value: 0,
		sliderId: "mid",
	}, {
		name: '高',
		value: 0,
		sliderId: "high",
	}, ])
</script>

<style lang="scss" scoped>
	.charts {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100% - 280rpx);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.charts_top {
			.word_box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.word {
					width: 20%;
					text-align: center;
				}
			}

		}

		.charts_bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.word {
				width: 20%;
				text-align: center;
			}
		}

		.word {
			font-size: 24rpx;
		}

		.slider_box {
			flex: 1;
			display: flex;
			flex-direction: row;
			justify-content: center;
			padding: 10rpx 0;

			.slider_list {
				flex: 1;
				display: flex;
				flex-direction: column;
				height: 100%;
				margin: 0 10rpx;

				.slider {
					flex: 1;
					margin-bottom: 10rpx;
					padding: 40rpx 0;
					border-radius: 30rpx;
					background-color: #f3f3f3;
					box-sizing: border-box;
				}

				.word {
					text-align: center;
					padding: 20rpx 0;
					border-radius: 30rpx;
					background-color: #f3f3f3;
					box-sizing: border-box;
				}

				.margin_b {
					margin-bottom: 10rpx;
				}
			}

		}
	}
</style>