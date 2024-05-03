const easePosition = (startPos, endPos, duration, setFunc, propName) => {
	const startArray = Array.isArray(startPos)
		? startPos
		: [startPos.x, startPos.y, startPos.z]

	let startTime = null
	let intervalId = null

	const updatePos = () => {
		const currentTime = Date.now()
		const elapsedTime = currentTime - startTime

		if (elapsedTime >= duration) {
			clearInterval(intervalId)
			setFunc(endPos)
		} else {
			const progress = easeInOutCubic(elapsedTime / duration)
			const newPos = [
				getValueBetween(startArray[0], endPos[0], progress),
				getValueBetween(startArray[1], endPos[1], progress),
				getValueBetween(startArray[2], endPos[2], progress),
			]
			setFunc(newPos)
		}
	}

	startTime = Date.now()
	intervalId = setInterval(updatePos, 16)
}

const easeNumber = (startY, endY, duration, setFunc, propName) => {
	let startTime = null
	let intervalId = null

	const updateNumber = () => {
		const currentTime = Date.now()
		const elapsedTime = currentTime - startTime

		if (elapsedTime >= duration) {
			clearInterval(intervalId)
			// setFunc({ [propName]: endY })
			setFunc(endY)
		} else {
			const progress = easeInOutCubic(elapsedTime / duration)
			const newY = getValueBetween(startY, endY, progress)
			setFunc(newY)
			// setFunc({ [propName]: newY })
		}
	}

	startTime = Date.now()
	intervalId = setInterval(updateNumber, 16)
}

function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function getValueBetween(start, end, progress) {
	progress = Math.max(0, Math.min(1, progress))
	return start + (end - start) * progress
}

export { easePosition, easeNumber }
