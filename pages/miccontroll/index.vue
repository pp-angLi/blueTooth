<template>
	<view class="box">
		<view class="eq_model">
			<Title title="PRIORITY" />
			<view class="padding_tb">
				<up-subsection :list="dodgeList.tabList" :current="dodgeList.activeIndex" @change="dodgeList.tabChange"
					bgColor="#f5f5f5" activeColor="#3c9cff" mode="subsection"></up-subsection>
			</view>
		</view>
		<view class="eq_model">
			<Title title="FBX" :ifSwitch="true">
				<template #switch>
					<up-switch v-model="switchOpen" activeColor="#5ac725" inactiveColor="#f56c6c"
						size="15">
					</up-switch>
				</template>
			</Title>
			<view class="padding_tb">
				<!-- 				<up-subsection :list="fbxList.tabList" :current="fbxList.activeIndex" @change="fbxList.tabChange"
					bgColor="#f5f5f5" activeColor="#3c9cff" mode="subsection"></up-subsection> -->
				<up-subsection class="fbx-margin" :list="howlingProofList.tabList" v-if="switchOpen"
					:current="howlingProofList.activeIndex" @change="howlingProofList.tabChange" bgColor="#f5f5f5"
					activeColor="#3c9cff" mode="subsection"></up-subsection>
			</view>
		</view>

		<MicrophoneChart class="eq_box" :switchOpen="switchOpen" />

		<PlayerVue class="play_box" sliderId="sliderIdMIC" titlename="MIC" :showButton="false" />
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
		provide
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
</script>

<style lang="scss" scoped>
	.box {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		box-sizing: border-box;

		.padding_tb {
			padding: 20rpx 0;
		}

		.number_box {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.word {
				padding-top: 20rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				text-align: center;
			}
		}

		.eq_model {
			margin-bottom: 20rpx;
			padding: 20rpx;
			border-radius: 30rpx;
			background-color: #fff;
		}


		.eq_box {
			padding: 20rpx;
			border-radius: 30rpx;
			background-color: #fff;
			flex: 1;
		}

		.play_box {
			margin-top: 20rpx;
			border-radius: 30rpx;
			background-color: #fff;
		}

		.word {
			display: inline-block;
			padding-right: 30rpx;
			text-align: center;
			font-size: 24rpx;
			color: #9c9c9c;
		}

		.eq_padding {
			padding-top: 50rpx;
		}

		.common_box {
			margin-top: 20rpx;
			border-radius: 30rpx;
			background-color: #fff;
		}

		.title-padding {
			padding-top: 20rpx;
			padding-bottom: 20rpx;
		}

		.button-container {
			display: flex;
			justify-content: center;
			/* 水平居中 */
			align-items: center;
			/* 垂直居中 */
		}

		.button-group {
			display: flex;
			gap: 20rpx;
			/* 按钮间距 */
		}

		.fbx-margin {
			margin-top: 20rpx;
		}
	}
</style>