<template>
	<view class="charts">
		<view class="charts_top">
			<Title title="MIC" />
		</view>
		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{ 0 - slider.value }}</view>
				<view class="slider">
					<pp-slider :vertical="true" :value="slider.value" :min="-dBF" :max="dBF" @changing="slider.func"
						backgroundColor="#3c9cff" activeColor="#9c9c9c" blockColor="#3c9cff" />
				</view>
				<view class="word">{{ slider.name }}</view>
			</view>
		</view>
	</view>
</template>

<script setup name="MicrophoneChart">
	import Title from '@/component/title/index.vue'
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref,
		watch,
		getCurrentInstance
	} from 'vue';

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;
	const dBF = 10

	const props = defineProps({
		switchOpen: {
			type: Boolean,
			default: true
		},
	})

	const components = reactive([
		markRaw(Title),
	]);

	// sendMessage写在这里
	const onSliderChange = (val, sliderId) => {
		const i = sliderList.findIndex(slider => slider.sliderId === sliderId)
		sliderList[i].value = val
	}

	const sliderList = reactive([{
		name: $translate('BASS'),
		value: 0,
		sliderId: "bass",
		func: (val) => {
			onSliderChange(val, "bass")
		}
	}, {
		name: $translate('MIDDLE'),
		value: 0,
		sliderId: "middle",
		func: (val) => {
			onSliderChange(val, "middle")
		}
	}, {
		name: $translate('TREBLE'),
		value: 0,
		sliderId: "treble",
		func: (val) => {
			onSliderChange(val, "treble")
		}
	}, ])
</script>

<style lang="scss" scoped>
	@import "@/static/scss/echartstyle.scss";
</style>