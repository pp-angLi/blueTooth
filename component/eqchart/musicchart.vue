<template>
	<view class="charts">
		<Title title="EQUALIZER" />
		<view class="word_box">
			<text class="word">{{ dBF }}dB</text>
		</view>
		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{
					0 - slider.value
				}}</view>
				<view class="slider">
					<pp-slider :vertical="true" :value="slider.value" :min="-dBF" :max="dBF" @changing="slider.func"
						backgroundColor="#3c9cff" activeColor="#9c9c9c" blockColor="#3c9cff" />
				</view>
				<view class="word">{{ slider.name }}</view>
			</view>
		</view>
		<view class="word_box">
			<text class="word">-{{ dBF }}dB</text>
		</view>
	</view>
</template>

<script setup name="MusicChart">
	import Title from '@/component/title/index.vue'
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref,
		getCurrentInstance
	} from 'vue';

	const dBF = 10

	const components = reactive([
		markRaw(Title),
	]);

	// sendMessage写在这里
	const onSliderChange = (val, sliderId) => {
		console.log(val)
		const i = sliderList.findIndex(slider => slider.sliderId === sliderId)
		sliderList[i].value = val
	}

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;

	const sliderList = reactive([{
		name: $translate("BASS"),
		sliderId: "bass",
		value: 0,
		min: -dBF,
		func: (val) => {
			onSliderChange(val, "bass")
		}
	}, {
		name: $translate("MIDDLE"),
		sliderId: "middle",
		value: 0,
		min: -dBF,
		func: (val) => {
			onSliderChange(val, "middle")
		}
	}, {
		name: $translate("TREBLE"),
		sliderId: "treble",
		value: 0,
		min: -dBF,
		func: (val) => {
			onSliderChange(val, "treble")
		}
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