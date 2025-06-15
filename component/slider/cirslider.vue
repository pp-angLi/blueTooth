<template>
	<view class="container"
		:style="'width: ' + width + 'rpx;height: ' + height + 'rpx;background-image: url(' + imamgPath + ');'"
		@touchstart="moveCirStart($event)" @touchmove="moveCirChange($event)" @touchend="moveCirEnd($event)">
		<view class="left">
			<view id="selectElement" class="left-circle"
				:style="'transform: rotate(' + computedSlider.circle1 + 'deg);'"></view>
		</view>
		<view class="right">
			<view class="right-circle" :style="'transform: rotate(' + computedSlider.circle2 + 'deg);'"></view>
		</view>
		<view class="mask">
			<view class="number">{{ temperatureValue }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			imamgPath: {
				type: String,
				default () {
					return '';
				}
			},
			width: {
				type: Number,
				default () {
					return 400;
				}
			},
			height: {
				type: Number,
				default () {
					return 400;
				}
			},
			initValue: {
				type: Number,
				default () {
					return 10;
				}
			},
			maxValue: {
				type: Number,
				default () {
					return 120;
				}
			}
		},
		data() {
			return {
				circleCenter: {
					x: 0,
					y: 0
				},
				temperatureValue: 0,
				valueRange: {
					max: 120,
					min: 0
				}, // 取值范围
				currentDisplayAngle: 0, // 当前需要旋转的角度(0 - 360)
				touchMoveAngle: 0, // 旋转的总角度
				touchAngle: 0, // 当前按下时的角度
				lastMoveAngle: 0, // 上一次移动时角度
			}
		},
		watch: {
			currentDisplayAngle(val) {
				// console.log( 360 / 64);
				const angleToVal = 360 / 100;
				this.temperatureValue = Math.round(val / angleToVal);
				// console.log();
				// 计算当前每一度温度，对应多少角度；
				// let count = Math.round(360 / (this.valueRange.max - this.valueRange.min));
				// this.temperatureValue = this.valueRange.min + Math.round(val / count);
			}
		},
		computed: {
			computedSlider() {
				// 进度条值
				const sliderVal = {
					circle1: -45,
					circle2: -45
				};
				const angleToVal = 360 / this.valueRange.max;
				const currentAngleVal = this.temperatureValue * angleToVal;
				if (currentAngleVal >= 180) {
					sliderVal.circle1 = sliderVal.circle1 + 180;
					sliderVal.circle2 = sliderVal.circle2 + (currentAngleVal - 180);
				} else {
					sliderVal.circle1 = sliderVal.circle1 + currentAngleVal;
				}
				return sliderVal;
			}
		},
		onLoad() {

		},
		created() {
			// 初始化当前角度
			if (this.valueRange.max < this.initValue) {
				console.log(new Error('The initial value cannot be greater than the maximum value.'));
				return;
			}
			this.temperatureValue = this.initValue;
			this.valueRange.max = this.maxValue;
			const angleToVal = 360 / this.valueRange.max;
			this.currentDisplayAngle = this.temperatureValue * angleToVal;
		},
		methods: {
			// 触摸外圆移动事件
			moveCirStart(event) {
				// 计算当前触摸坐标，相对于圆心的象限
				const coorX = this.circleCenter.x - event.touches[0].pageX;
				const coorY = event.touches[0].pageY - this.circleCenter.y;
				// 当前鼠标距离圆心的角度 
				const cirAngle = Math.atan2(coorX, coorY) / Math.PI * 180;
				const angleVal = cirAngle > 0 ? cirAngle : 360 - (cirAngle * -1);
				// 记录当前按下时的角度
				this.touchAngle = angleVal - this.touchMoveAngle;
				// console.log('当前按下时的角度',this.touchAngle);
			},
			// 触摸外圆移动事件
			moveCirChange(event) {
				// 计算当前触摸坐标，相对于圆心的象限
				const coorX = this.circleCenter.x - event.touches[0].pageX;
				const coorY = event.touches[0].pageY - this.circleCenter.y;
				// 当前鼠标距离圆心的角度 
				const cirAngle = Math.atan2(coorX, coorY) / Math.PI * 180;
				const angleVal = cirAngle > 0 ? cirAngle : 360 - (cirAngle * -1);
				this.touchMoveAngle = angleVal - this.touchAngle;

				// 计算当前移动的值
				let currentValue = this.currentDisplayAngle + (this.touchMoveAngle - this.lastMoveAngle);
				if (currentValue > 0 && currentValue < 360) {
					this.currentDisplayAngle += this.touchMoveAngle - this.lastMoveAngle;
				} else {
					// debugger
					// 当移动到最大或最小值 相差为1以内时，直接为最大值，或最小值
					if (this.currentDisplayAngle < 1 && this.currentDisplayAngle > 0) {
						this.currentDisplayAngle = 0;
					} else if (this.currentDisplayAngle < 360 && this.currentDisplayAngle > 359) {
						this.currentDisplayAngle = 360;
					}
				}
				this.lastMoveAngle = this.touchMoveAngle;
				// console.log(this.lastMoveAngle);
			},
			// 触摸移动事件结束
			moveCirEnd(event) {
				// this.changeBtn('value',this.temperatureValue);
				// console.log('移动结束');
			}
		},
		mounted() {
			// 初始化数据
			const _this = this;
			const query = uni.createSelectorQuery().in(this);
			query.select('#selectElement').boundingClientRect(data => {
				// 初始化、获取当前圆心坐标
				_this.circleCenter.x = (data.left + data.width / 2);
				_this.circleCenter.y = (data.top + data.height / 2);
			}).exec();
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 400rpx;
		height: 400rpx;
		position: relative;
		background-image: url('../../static/img.jpg');
		background-size: 100% 100%;

		.left {
			position: absolute;
			top: 0;
			left: 0;
			width: 50%;
			height: 100%;
			overflow: hidden;

			.left-circle {
				position: absolute;
				left: 0;
				width: 200%;
				height: 100%;
				border: 10px solid orange;
				border-radius: 50%;
				box-sizing: border-box;
				border-top-color: transparent;
				border-left-color: transparent;
				transform: rotate(-45deg);
				box-sizing: border-box;
				// animation: circleRotate 2s linear forwards 2s;
			}
		}

		.right {
			position: absolute;
			top: 0;
			right: 0;
			width: 50%;
			height: 100%;
			overflow: hidden;

			/* background-color: rgb(22, 133, 70); */
			.right-circle {
				position: absolute;
				right: 0;
				width: 200%;
				height: 100%;
				border: 10px solid orange;
				border-radius: 50%;
				box-sizing: border-box;
				border-bottom-color: transparent;
				border-right-color: transparent;
				transform: rotate(-45deg);
				// animation: circleRotate 2s linear forwards;
			}
		}

		.mask {
			width: 30%;
			height: 40%;
			color: #fff;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			left: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.number {
			color: red;
			font-size: 30px;
		}
	}

	// @keyframes circleRotate {
	//   from {
	//     transform: rotate(-45deg);
	//   }

	//   to {
	//     transform: rotate(180deg);
	//   }
	// }
</style>