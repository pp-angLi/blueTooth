import {
	defineStore
} from 'pinia'

export const useTabStore = defineStore('tab', {
	state: () => ({
		bluetoothData: {}
	}),
	actions: {
		setBluetoothData(data) {
			this.bluetoothData = data
		}
	},
})