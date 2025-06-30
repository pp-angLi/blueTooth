<template>
	<view class="charts">
		<!-- <CirsliderVue /> -->
		<view class="charts_top">
			<Title title="EFFECT" />
		</view>
		<PlayerVue class="play_box" :showButton="false" word="REVERB VOL" :showIcon="false" sliderId="sliderH" />
		<PlayerVue class="play_box" :showButton="false" word="ECHO VOL" :showIcon="false" sliderId="sliderHS" />
		<view class="slider_box">
			<view class="slider_list" v-for="(slider, i) in sliderList" :key="slider.name">
				<view class="word margin_b">{{ slider.value }}</view>
				<view class="slider">
					<SliderVue :disabled="slider.disabled" :value="slider.value" :sliderId="slider.sliderId"
						:onSliderChange="onSliderChange" :max="dBF" />
				</view>
				<view class="word">{{ slider.name }}</view>
			</view>
		</view>
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
		ref,
		getCurrentInstance,
		watch
	} from 'vue';

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;
	const dBF = 30

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
		name: $translate("REVERB TIME"),
		value: 0,
		sliderId: "reverbtime"
	}, {
		name: $translate("REPEAT"),
		value: 0,
		sliderId: "repeat"
	}, {
		name: $translate("DELAY"),
		value: 0,
		sliderId: "repeat"
	}, ])
</script>

<style lang="scss" scoped>
	@import "@/static/scss/echartstyle.scss";
</style>