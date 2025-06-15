export const hexCharCodeToStr = hexCharCodeStr => {
	const trimedStr = hexCharCodeStr.trim();
	const rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
	const len = rawStr.length;
	if (len % 2 !== 0) {
		alert("存在非法字符!");
		return "";
	}
	const resultStr = [];
	let curCharCode;
	for (let i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
}

// ArrayBuffer转16进度字符串示例
export const ab2hex = buffer => {
	const hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('')
}

export const extractPercentToDecimal = (percentStr) => {
	// 提取数字（含小数）
	const match = percentStr.match(/\d+(\.\d+)?/);
	if (!match) return NaN;
	return parseFloat(match[0]);
}