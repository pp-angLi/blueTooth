<template>
	<qiun-data-charts v-else class="eq" type="line" :opts="opts" :chartData="chartData"
		@touchstart.stop.prevent="handleTouchStart" @touchmove.stop.prevent="handleTouchMove" />

	</view>
</template>

<script setup>
	import {
		nextTick,
		onMounted,
		reactive,
		markRaw,
		ref
	} from 'vue';

	const chartData = ref({})
	const opts = reactive({
		update: true, // ✅ 关键：启用连续更新模式（避免重绘抖动）
		animation: false, // ✅ 禁用动画效果
		duration: 0, // ✅ 关闭动画过渡时间
		color: ["#3c9cff"],
		padding: [40, 0, 40, 0],
		enableScroll: false,
		legend: {
			show: false,
		},
		dataLabel: false,
		dataPointShape: true,
		xAxis: {
			disableGrid: true,
			axisLine: false,
			fontSize: 0
		},
		yAxis: {
			// disabled: true,
			// disableGrid: true,
			min: -6, // 增益最小值
			max: 6 // 增益最大值
		},
		extra: {
			line: {
				type: "curve",
				width: 4,
				activeType: "hollow",
				activePoint: true // 启用数据点交互
			},

			point: {
				selectedColor: "#3c9cff", // 选中点颜色
				selectedSize: 8 // 选中点放大
			}
		}
	})

	const getServerData = () => {
		//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
		let res = {
			categories: ["20", "100", "500", "1K", "5K"],
			series: [{
				name: "EQ-Line",
				lineType: "solid",
				data: [0, 0, 0, 0, 0]
			}]
		};
		chartData.value = JSON.parse(JSON.stringify(res));
	}

	const page = reactive({})

	// 数据定义
	const activeIndex = ref(-1); // 当前拖拽点的索引

	// 触摸开始事件
	const handleTouchStart = (e) => {
		const {
			changedTouches
		} = e
		const point = changedTouches[0];
		// 计算点击位置最近的频段索引
		const index = Math.round((point.pageX / page.width) * (chartData.value.categories.length - 1));
		activeIndex.value = index;
	};

	const chartKey = ref(Date.now())
	const updateChart = () => {
		chartKey.value = Date.now()
	}

	// 触摸移动事件
	const handleTouchMove = (e) => {
		if (activeIndex.value === -1) return;
		const {
			changedTouches
		} = e
		const point = changedTouches[0];
		// 计算增益值（根据画布高度映射到[-6,6]区间）
		const gainRange = 12; // -6dB ~ 6dB
		const newValue = 6 - (point.pageY / page.height) * gainRange;

		// 更新数据点
		const newData = [...chartData.value.series[0].data];
		newData[activeIndex.value] = Math.max(-6, Math.min(6, newValue));

		chartData.value = {
			...chartData.value,
			series: [{
				...chartData.value.series[0],
				data: newData
			}]
		};
		// updateChart()
	};

	onMounted(async () => {
		await nextTick()
		getServerData()
		const query = uni.createSelectorQuery().in(this); // .in(this) 确保组件作用域
		query.select('.eq').boundingClientRect(rect => {
			if (rect) {
				page.width = rect.width
				page.height = rect.height
			}
		}).exec();
	})
</script>

<style lang="scss" scoped>
	.eq {
		flex: 1;
	}
</style>