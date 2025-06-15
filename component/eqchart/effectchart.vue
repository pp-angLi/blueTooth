<template>
	<view class="charts">
		<!-- <CirsliderVue /> -->
		<view class="charts_top">
			<Title title="Effect" />
			<!-- 			<view class="word_box">
				<text class="word">100dB</text>
			</view> -->
		</view>
		<PlayerVue class="play_box" :showButton="false" word="混响音量" :showIcon="false" sliderId="sliderH" />
		<PlayerVue class="play_box" :showButton="false" word="回声音量" :showIcon="false" sliderId="sliderHS" />
		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{ slider.value }}</view>
				<view class="slider">
					<SliderVue :disabled="slider.disabled" :value="slider.value" :sliderId="slider.sliderId"
						:onSliderChange="onSliderChange" />
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
	import PlayerVue from '@/component/player/index.vue'
	import CirsliderVue from "@/component/slider/cirslider.vue"
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref
	} from 'vue';

	const components = reactive([
		markRaw(SliderVue),
		markRaw(Title),
		markRaw(PlayerVue),
		markRaw(CirsliderVue)
	]);

	// sendMessage写在这里
	const onSliderChange = (val, sliderId) => {
		const i = sliderList.findIndex(slider => slider.sliderId === sliderId)
		sliderList[i].value = val
	}

	const sliderList = reactive([{
			name: 'reverb time',
			value: 0,
			sliderId: "reverbtime"
		}, {
			name: 'repeat',
			value: 0,
			sliderId: "repeat"
		}, {
			name: 'delay',
			value: 0,
			sliderId: "repeat"
		},
		// {
		// 	name: '混响音量',
		// 	value: 0,
		// },{
		// 	name: '回声音量',
		// 	value: 0,
		// },
	])
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

		.play_box {
			margin-top: 20rpx;
			border-radius: 30rpx;
			background-color: #fff;
		}

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

		.s_box {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 20rpx 40rpx;
			box-sizing: border-box;

			.word {
				display: inline-block;
				padding-right: 30rpx;
				text-align: center;
				font-size: 24rpx;
				color: #9c9c9c;
			}

			.slider {
				flex: 1;
			}
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
					white-space: nowrap;
				}

				.margin_b {
					margin-bottom: 10rpx;
				}
			}

		}
	}
</style>