export default function easePosition(
	startPos,
	endPos,
	duration,
	setFunc,
	propName
) {
	const startArray = Array.isArray(startPos)
		? startPos
		: [startPos.x, startPos.y, startPos.z]

	let startTime = null
	let intervalId = null

	const updateCamPos = () => {
		const currentTime = Date.now()
		const elapsedTime = currentTime - startTime

		if (elapsedTime >= duration) {
			clearInterval(intervalId)
		} else {
			const progress = easeInOutCubic(elapsedTime / duration)
			const newPos = [
				getValueBetween(startArray[0], endPos[0], progress),
				getValueBetween(startArray[1], endPos[1], progress),
				getValueBetween(startArray[2], endPos[2], progress),
			]
			// If using in a store, update the position
			if (propName != null) {
				setFunc({ [propName]: newPos })
			} else {
				setFunc(newPos)
			}
		}
	}

	startTime = Date.now()
	intervalId = setInterval(updateCamPos, 16)
}

function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function getValueBetween(start, end, progress) {
	progress = Math.max(0, Math.min(1, progress))
	return start + (end - start) * progress
}
