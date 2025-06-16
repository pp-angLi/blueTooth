<template>
	<view class="title">
		<text>
			{{ title }}
		</text>
		<slot name="switch"></slot>
	</view>
</template>

<script setup name="Title">
import { ref } from 'vue';

	const props = defineProps({
		title: "",
	})
	
	const value11 = ref(false)
</script>

<style lang="scss" scoped>
	.title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>