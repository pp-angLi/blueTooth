<template>
	<view class="ctrol_box">
		<view class="eq_model">
			<Title :title="$translate('PRIORITY')">
				<template #switch>
					<up-switch v-model="switchOpen" activeColor="#5ac725" inactiveColor="#f56c6c" size="15">
					</up-switch>
				</template>
			</Title>
			<!-- 			<view class="padding_tb">
				<up-subsection :list="dodgeList.tabList" :current="dodgeList.activeIndex" @change="dodgeList.tabChange"
					bgColor="#f5f5f5" activeColor="#3c9cff" mode="subsection"></up-subsection>
			</view> -->
		</view>
		<view class="eq_model">
			<Title :title="$translate('FBX')">
				<template #switch>
					<up-switch v-model="switchOpenFBX" activeColor="#5ac725" inactiveColor="#f56c6c" size="15">
					</up-switch>
				</template>
			</Title>
			<view class="padding_tb" v-if="switchOpenFBX">
				<!-- 				<up-subsection :list="fbxList.tabList" :current="fbxList.activeIndex" @change="fbxList.tabChange"
					bgColor="#f5f5f5" activeColor="#3c9cff" mode="subsection"></up-subsection> -->
				<up-subsection class="fbx_margin" :list="howlingProofList.tabList"
					:current="howlingProofList.activeIndex" @change="howlingProofList.tabChange" bgColor="#f5f5f5"
					activeColor="#3c9cff" mode="subsection"></up-subsection>
			</view>
		</view>

		<MicrophoneChart class="eq_box" :switchOpenFBX="switchOpenFBX" />

		<PlayerVue class="play_box" sliderId="sliderIdMIC" :showButton="false" />
		<up-toast ref="uToastRef"></up-toast>
	</view>
</template>
​
<script setup name="MicControll">
	import PlayerVue from '@/component/player/index.vue'
	import MicrophoneChart from '@/component/eqchart/microphonechart.vue'
	import Title from '@/component/title/index.vue'
	import {
		ref,
		reactive,
		watch,
		markRaw,
		provide,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		useTabStore
	} from '@/stores/tarData'
	import {
		storeToRefs
	} from 'pinia'

	const instance = getCurrentInstance()
	const $translate = instance.appContext.config.globalProperties.$translate;

	const components = reactive([
		markRaw(PlayerVue),
		markRaw(MicrophoneChart),
		markRaw(Title),
	]);

	const uToastRef = ref(null)
	// 将 ref 暴露给子组件（通过 provide 或 props）
	provide('fatherRef', {
		uToastRef
	});

	const tabStore = useTabStore()
	const dodgeList = reactive({
		tabList: [{
			name: 'OPEN',
			num: 0,
		}, {
			name: 'CLOSE',
			num: 1,
		}],
		activeIndex: 0,
		tabChange: index => {
			dodgeList.activeIndex = index;
		}
	})

	const howlingProofList = reactive(({
		tabList: [{
			name: "L1",
			num: 0
		}, {
			name: "L2",
			num: 0
		}, {
			name: "L3",
			num: 0
		}],
		activeIndex: 0,
		tabChange: index => {
			howlingProofList.activeIndex = index;
		}
	}))

	const switchOpen = ref(false)
	const switchOpenFBX = ref(false)
</script>

<style lang="scss" scoped>
	@import "@/static/scss/controll.scss";

	.padding_tb {
		padding: 20rpx 0;
	}

	.eq_model {
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 30rpx;
		background-color: #fff;
	}

	.fbx_margin {
		margin-top: 20rpx;
	}
</style>