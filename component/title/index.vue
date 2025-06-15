<template>
	<view class="title">{{ title }}</view>
</template>

<script setup name="Title">
	const props = defineProps({
		title: ""
	})
</script>

<style lang="scss" scoped>
	.title {
		font-size: 28rpx;
		font-weight: bold;
	}
</style>