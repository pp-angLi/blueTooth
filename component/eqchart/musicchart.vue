<template>
	<view class="charts">
		<Title title="EQUALIZER" />
		<view class="word_box">
			<text class="word">12dB</text>
		</view>
		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{
					slider.value + slider.min
				}}</view>
				<view class="slider">
					<SliderVue :disabled="slider.disabled" :value="slider.value" :max="24" :min="slider.min"
						:sliderId="slider.name" :onSliderChange="onSliderChange" />
				</view>
				<view class="word">{{ slider.name }}</view>
			</view>
		</view>
		<view class="word_box">
			<text class="word">-12dB</text>
		</view>
	</view>
</template>

<script setup name="MusicChart">
	import Title from '@/component/title/index.vue'
	import SliderVue from '@/component/slider/index.vue'
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref,
		getCurrentInstance
	} from 'vue';

	const components = reactive([
		markRaw(SliderVue),
		markRaw(Title),
	]);

	// sendMessage写在这里
	const onSliderChange = (val, sliderId) => {
		const i = sliderList.findIndex(slider => slider.name === sliderId)
		sliderList[i].value = val
	}

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;

	const sliderList = reactive([{
		name: $translate("BASS"),
		value: 0,
		min: -12,
	}, {
		name: $translate("MID"),
		value: 0,
		min: -12,
	}, {
		name: $translate("TREB"),
		value: 0,
		min: -12,
	}])
</script>

<style lang="scss" scoped>
	@import "@/static/scss/echartstyle.scss";

	.word_box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5rpx 0;

		.word {
			width: 20%;
			text-align: center;
		}
	}
</style>