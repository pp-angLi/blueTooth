<template>
	<view class="box" ref="musicControll">
		<view class="eq_model">
			<Title title="EQ MODE" />
			<view class="padding_tb">
				<up-subsection :list="tabList" :current="activeIndex" @change="handleTabChange" bgColor="#f5f5f5"
					activeColor="#3c9cff" mode="subsection"></up-subsection>
			</view>
		</view>
		
		<view class="eq_box">
			<Title title="MUSIC EQ"/>
			<view class="eq_padding">
			<view>
				<text class="word">TREB</text>
				<slider value="50" @changing="sliderChange" block-size="20" block-color=" #3c9cff" show-value />
			</view>
			<view>
				<text class="word">MID</text>
				<slider value="50" @changing="sliderChange" block-size="20" block-color=" #3c9cff" show-value />
			</view>
			<view>
				<text class="word">BASS</text>
				<slider value="50" @changing="sliderChange" block-size="20" block-color=" #3c9cff" show-value />
			</view>
			</view>
		</view>
		
		
		<PlayerVue class="play_box" word="VOL" sliderId="sliderIdMUISC" titlename="MUSIC"/>
		
		<view class="common_box">
			<Title title="COMMON FUNC"/>
			<view class="title-padding button-container">
				<view class="button-group">
					<button  type="default" size="mini">INPUT</button>
					<button  type="default" size="mini">MUTE</button>
				</view>
			</view>
		</view>
		
		<up-toast ref="uToastRef"></up-toast>
	</view>
</template>
​
<script setup name="MusicControll">
	import PlayerVue from '@/component/player/index.vue'
	import MusicChart from '@/component/eqchart/musicchart.vue'
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
		markRaw(MusicChart),
		markRaw(Title),
	]);

	const uToastRef = ref(null)
	// 将 ref 暴露给子组件（通过 provide 或 props）
	provide('fatherRef', {
		uToastRef
	});

	const tabStore = useTabStore()
	const activeIndex = ref(0)
	const tabList = [{
		name: '古典',
		num: 0,
	}, {
		name: '爵士',
		num: 1,
	}, {
		name: '流行',
		num: 2,
	}, {
		name: '摇滚',
		num: 3,
	}, {
		name: '人声',
		num: 4,
	}];
	// 切换Tab回调
	const handleTabChange = (index) => {
		activeIndex.value = index;
		// sendMessage写在这里
	};

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
		
		.eq_padding{
			padding-top: 50rpx;
		}
		
		.common_box{
			margin-top: 20rpx;
			border-radius: 30rpx;
			background-color: #fff;
		}
		
		.title-padding{
			padding-top: 20rpx;
			padding-bottom: 20rpx;
		}
		
		.button-container{
			display: flex;
			justify-content: center; /* 水平居中 */
			align-items: center;    /* 垂直居中 */
		}
		
		.button-group {
		  display: flex;
		  gap: 20px; /* 按钮间距 */
		}
	}
</style>