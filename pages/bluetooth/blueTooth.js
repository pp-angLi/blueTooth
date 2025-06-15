import {
	hexCharCodeToStr,
	ab2hex
} from '../../utils/utils.js'
import {
	useTabStore
} from '@/stores/tarData';
import {
	reactive
} from 'vue'

export default class BlueTooth {
	constructor({
		openConfirm,
		timeoutId,
		blueDeviceList,
		deviceId,
		serviceIds
	}) {
		return reactive({
			// 蓝牙设备列表
			blueDeviceList,
			// 蓝牙设备的id
			deviceId: deviceId || "",
			// 硬件提供的服务id，开发中需要问硬件佬获取该id
			serviceIds: serviceIds || [],
			// 硬件提供的特征值id，开发中需要问硬件佬获取该id
			characteristicIds: [],
			// 监听到的内容
			message: "",
			// 监听到的内容十六进制
			messageHex: "",
			// 修改的蓝牙名
			inputMessage: "",
			// 父元素同的方法
			openConfirm: openConfirm,
			// 定时器
			timeoutId: timeoutId,
			// 【0】检查是否打开蓝牙
			checkBluetoothEnabled(callback) {
				const that = this
				// 初始化蓝牙适配器（必须先调用！）
				uni.openBluetoothAdapter({
					success: () => {
						// 获取蓝牙开关状态
						uni.getBluetoothAdapterState({
							success: (res) => {
								console.log(res)
								if (res.available) {
									console.log("蓝牙已开启");
									callback && callback(true)
								} else {
									console.log("蓝牙未开启");
								}
							}
						});
					},
					fail: (err) => {
						if (err.code === 10001) {
							that.openConfirm()
							callback && callback(false)
						}
					}
				});
			},

			// 【1】初始化蓝牙
			initBlueT(callback) {
				const that = this

				// 安卓端检查蓝牙是否打开
				function checkBluetoothPermission() {
					const main = plus.android.runtimeMainActivity();
					// Android 12+ 需检查 BLUETOOTH_SCAN 权限
					const hasScanPerm = main.checkSelfPermission("android.permission.BLUETOOTH_SCAN") === 0;
					// Android 6.0+ 需检查定位权限（蓝牙扫描依赖）
					const hasLocPerm = main.checkSelfPermission(
						"android.permission.ACCESS_FINE_LOCATION") === 0;
					return hasScanPerm && hasLocPerm;
				}

				// Android 权限检查
				function initBluetooth() {
					if (!checkBluetoothPermission()) {
						plus.android.requestPermissions(
							["android.permission.BLUETOOTH_SCAN",
								"android.permission.ACCESS_FINE_LOCATION"
							],
							(res) => {
								if (res.deniedAlways.length > 0) {
									uni.showModal({
										title: "提示",
										content: "请在系统设置中开启权限",
										success: () => plus.android.openSystemSettings()
									});
								} else {
									that.checkBluetoothEnabled(callback); // 权限通过后检查蓝牙开关
								}
							}
						);
						return;
					}
					// 检查蓝牙开关
					that.checkBluetoothEnabled(callback);
				}

				// 检测是否为鸿蒙系统
				function checkHarmonyOS(systemInfo) {
					const ua = systemInfo.userAgent || navigator.userAgent;
					if (ua.includes('ohos') || ua.includes('harmony')) {
						console.log('鸿蒙系统');
					} else {
						console.log('其他设备', platform);
					}
				}

				const systemInfo = uni.getSystemInfoSync();
				const platform = systemInfo.platform.toLowerCase(); // 转为小写

				if (platform === 'android') {
					console.log('Android 设备');
					initBluetooth()
				} else if (platform === 'ios') {
					console.log('iOS 设备');
				} else {
					// 处理鸿蒙或其他平台
					checkHarmonyOS(systemInfo); // 调用鸿蒙检测方法
				}
			},

			// 【2】开始搜寻附近设备
			disBlueT() {
				let found = this.found.bind(this)
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: false, // 禁止重复上报同一设备
					success: () => {
						console.log('开始搜索')
						// 开启监听回调
						uni.onBluetoothDeviceFound(devices => {
							const validDevices = devices.devices.filter(device => device
								.name && device.deviceId)
							if (validDevices.length) {
								found(validDevices)
							}
						});
					},
					fail(err) {
						console.log('搜索失败')
						console.error(err)
					}
				})
			},

			// 【3】找到新设备就触发该方法
			found(res) {
				if (res.length) {
					let blueDeviceList = this.blueDeviceList.map(val => val.deviceId)
					for (let i = 0; i < res.length; i++) {
						if (blueDeviceList.includes(res[i].deviceId)) {
							continue;
						}
						this.blueDeviceList.push(res[0])
					}
				}
			},

			// 【4】连接设备
			connectHandler(data, index, callback) {
				// 先关闭，后连接
				// 如果已经连接了，先断开
				if (this.deviceId) {
					this.closeBLE({
						data,
						index,
						callback,
					})
				} else {
					this.connect(data, index, callback)
				}
			},
			connect(data, index, callback) {
				this.deviceId = data.deviceId // 将获取到的设备ID存起来
				console.log('当前保存的id值为:' + this.deviceId)

				const that = this
				callback(index)
				uni.createBLEConnection({
					deviceId: this.deviceId,
					success(res) {
						console.log('连接成功')
						console.log(res)
						// 停止搜索
						that.stopDiscovery()
						uni.showToast({
							title: '连接成功'
						})
						callback(-1)
						//获取蓝牙服务
						// 延迟1秒后执行发现（模拟等待设备准备）
						that.timeoutId = setTimeout(() => {
							that.getServices();
						}, 1000);

						//获取特征值
						// that.timeoutId = setTimeout(() => {
						// 	that.getCharacteristics();
						// }, 2000);
					},
					fail(err) {
						console.log('连接失败')
						console.error(err)
						uni.showToast({
							title: '连接失败',
							icon: 'error'
						})
						that.clearDeviceId()
						callback(-1)
					}
				})
			},

			// 【5】停止搜索
			stopDiscovery() {
				uni.stopBluetoothDevicesDiscovery({
					success(res) {
						console.log('停止成功')
						console.log(res)
					},
					fail(err) {
						console.log('停止失败')
						console.error(err)
					}
				})
			},

			// 【6】获取服务
			getServices() {
				const that = this
				// 如果是自动链接的话，uni.getBLEDeviceServices方法建议使用setTimeout延迟1秒后再执行
				uni.getBLEDeviceServices({
					deviceId: that.deviceId,
					success(res) {
						console.log(res) // 可以在res里判断有没有硬件佬给你的服务
						for (let i = 0; i < res.services.length; i++) {
							if (res.services[i]) {
								that.serviceIds.push(res.services[i].uuid);
							}
							// console.log(this.serviceIds[i]) // 可以在res里判断有没有硬件佬给你的服务
						}
						uni.showToast({
							title: '获取服务成功'
						})

						let title = ""
						for (let i = 0; i < that.blueDeviceList.length; i++) {
							if (that.deviceId === that.blueDeviceList[i].deviceId) {
								title = that.blueDeviceList[i].name
							}
						}

						const store = useTabStore();
						store.setBluetoothData({
							deviceId: that.deviceId,
							serviceIds: that.serviceIds
						}); // 更新数据
					},
					fail(err) {
						console.error(err)
						uni.showToast({
							title: '获取服务失败',
							icon: 'error'
						})
					}
				})
			},

			// 【7】获取特征值
			getCharacteristics() {
				const that = this
				let timer
				let flag = true
				let timer2
				// 如果是自动链接的话，uni.getBLEDeviceCharacteristics方法建议使用setTimeout延迟1秒后再执行
				for (let i = 0; i < that.serviceIds.length; i++) {
					uni.getBLEDeviceCharacteristics({
						deviceId: that.deviceId,
						serviceId: that.serviceIds[i],
						success(res) {
							if (flag) {
								uni.showToast({
									title: '获取特征值成功',
								})
								flag = false
							}
							timer = setTimeout(() => {
								flag = true
							}, 1000)
							clearTimeout(timer)
							console.log(res) // 可以在此判断特征值是否支持读写等操作，特征值其实也需要提前向硬件佬索取的
							let characteristicIds = []
							for (let i = 0; i < res.characteristics.length; i++) {
								characteristicIds.push(res.characteristics[i].uuid)
							}
							const serviceIdIndex = that.characteristicIds.findIndex(val => val
								.serviceId === that.serviceIds[i])
							if (serviceIdIndex > -1) {
								that.characteristicIds[serviceIdIndex].characteristicIds =
									characteristicIds
							} else {
								that.characteristicIds.push({
									serviceId: that.serviceIds[i],
									characteristicIds
								})
							}
							clearTimeout(timer2)
							timer2 = setTimeout(() => {
								that.notify()
							}, 333)

							// 最终打印所有特征值
							// console.log('所有特征值:', that.characteristicIds)
						},
						fail(err) {
							console.error(err)
							if (flag) {
								uni.showToast({
									title: '获取特征值失败',
									icon: 'error',
								})
								flag = false
							}
							timer = setTimeout(() => {
								flag = true
							}, 1000)

						}
					})
				}
			},

			// 【8】开启消息监听
			notify() {
				// 最终打印所有特征值
				console.log('所有服务:', this.serviceIds)
				// 最终打印所有特征值
				console.log('所有特征值:', this.characteristicIds)
				const that = this
				that.characteristicIds.forEach(char => {
					console.log(char);
					for (let i = 0; i < char.characteristicIds.length; i++) {
						setTimeout(() => {
							uni.notifyBLECharacteristicValueChange({
								deviceId: that.deviceId, // 设备id
								serviceId: char.serviceId, // 监听指定的服务
								characteristicId: char.characteristicIds[i], // 监听对应的特征值
								success(res) {
									console.log(res)
									that.listenValueChange(char.characteristicIds[i])
									uni.showToast({
										title: `已开启监听${char.characteristicIds[i]}`
									})
								},
								fail(err) {
									console.error(err)
									uni.showToast({
										title: `${char.characteristicIds[i]}监听失败`,
										icon: 'error'
									})
								}
							})
						}, 50 * i)
					}
				});
			},

			// 【9】监听消息变化
			listenValueChange(char) {
				console.log('aaaaaaaaaaaaaaaaaa');
				const that = this
				uni.onBLECharacteristicValueChange(res => {
					console.log(res,`通过特征值${char}触发`)
					if(res.characteristicId === char){
						let resHex = ab2hex(res.value)
						console.log(resHex)
						that.messageHex = resHex
						let result = hexCharCodeToStr(resHex)
						console.log(String(result))
						that.message = String(result)
					}
				})
			},

			// 【10】发送数据
			sendHex() {
				// 向蓝牙设备发送一个0x00的16进制数据
				let msg = 'hello'

				const buffer = new ArrayBuffer(msg.length)
				const dataView = new DataView(buffer)
				// dataView.setUint8(0, 0)

				for (var i = 0; i < msg.length; i++) {
					dataView.setUint8(i, msg.charAt(i).charCodeAt())
				}

				const that = this
				uni.writeBLECharacteristicValue({
					deviceId: that.deviceId,
					serviceId: that.serviceIds,
					characteristicId: that.characteristicIds,
					value: buffer,
					success(res) {
						console.log('writeBLECharacteristicValue success', res.errMsg)
						// uni.showToast({
						//     title: 'write指令发送成功'
						// })
					},
					fail(err) {
						console.error(err)
						// uni.showToast({
						//     title: 'write指令发送失败',
						//     icon: 'error'
						// })
					}
				})
			},

			// 【11】读取数据
			read() {
				const that = this
				uni.readBLECharacteristicValue({
					deviceId: that.deviceId,
					serviceId: that.serviceIds,
					characteristicId: that.characteristicIds,
					success(res) {
						console.log(res)
						uni.showToast({
							title: 'read指令发送成功'
						})
					},
					fail(err) {
						console.error(err)
						uni.showToast({
							title: 'read指令发送失败',
							icon: 'error'
						})
					}
				})
			},

			// 【12】修改蓝牙名称
			sendBlueTName() {
				console.log(this.inputMessage)
				// 向蓝牙设备发送一个0x00的16进制数据
				let msg = this.inputMessage
				console.log(msg)
				const buffer = new ArrayBuffer(msg.length)
				const dataView = new DataView(buffer)
				// dataView.setUint8(0, 0)

				for (var i = 0; i < msg.length; i++) {
					dataView.setUint8(i, msg.charAt(i).charCodeAt())
				}

				const that = this
				uni.writeBLECharacteristicValue({
					deviceId: that.deviceId,
					serviceId: that.serviceIds,
					characteristicId: that.characteristicIds,
					value: buffer,
					success(res) {
						console.log('writeBLECharacteristicValue success', res.errMsg)
						uni.showToast({
							title: '修改蓝牙名成功'
						})
					},
					fail(err) {
						console.error(err)
						uni.showToast({
							title: '修改蓝牙名失败',
							icon: 'error'
						})
					}
				})
			},

			// 【13】断开蓝牙
			clearDeviceId() {
				this.deviceId = ""
			},
			closeBLE({
				data,
				index,
				callback,
				flag
			}) {
				// 针对部分国产机型（华为/小米）需强制回收资源
				// 安卓
				try {
					const that = this
					uni.closeBLEConnection({
						deviceId: that.deviceId,
						success: () => {
							console.log("已断开")
							// 完全释放资源
							if (flag) {
								uni.closeBluetoothAdapter()
							}
							if (data.deviceId !== that.deviceId) {
								setTimeout(() => that.connect(data, index, callback), 500)
							} else {
								that.clearDeviceId()
								uni.showToast({
									title: '已断开连接'
								})
								callback(-1)
							}
						},
						fail: (err) => console.error("❌ 断开失败", err)
					});
				} catch (e) {
					plus.bluetooth.close(); // 调用5+原生接口兜底
				}
			}
		})
	}
}