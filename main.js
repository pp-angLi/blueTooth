import uviewPlus from 'uview-plus'

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import * as Pinia from 'pinia' // 导入 Pinia 核心库

import App from './App.vue'
import chinese from '@/translate/chinese.js'
import english from '@/translate/english.js'

export function createApp() {
	const app = createSSRApp(App)
	app.use(uviewPlus, () => {
		return {
			options: {
				// 修改config对象的属性
				config: {
					// 默认字体图标自托管资源地址
					// iconUrl: 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf'
				}
			}
		}
	})
	const pinia = Pinia.createPinia()
	app.use(pinia)

	app.config.globalProperties.$translate = (key) => {
		const locale = uni.getStorageSync('locale') || uni.getSystemInfoSync().language;
		let translations
		if (locale === "zh-CN" || locale === "zh-Hans") {
			translations = chinese
		} else {
			translations = english
		}
		return translations[key] || key;
	};
	return {
		app,
		Pinia
	}
}
// #endif