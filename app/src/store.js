import { create } from "zustand"
import { fetchWithToken } from "./requests"
const dbHost = import.meta.env.VITE_DB_HOST
import gsap from "gsap"

gsap.registerPlugin()

const useBoxStore = create(set => ({
	activeBox: null,
	loadBox: boxId => {
		fetch(dbHost + "/box/" + boxId)
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
			.then(data => {
				set({ activeBox: data })
			})
			.catch(error => {
				console.error("Error fetching data:", error)
			})
	},
}))

const useNoteStore = create(set => ({
	isDraggingNote: false,
	setIsDraggingNote: newValue => set({ isDraggingNote: newValue }),
}))

const useCamStore = create(set => ({
	camRef: null,
	camPos: [0, 45, 200],
	setCamRef: newValue => set({ camRef: newValue }),
	resetCamPos: () => {
		const duration = 250 // Duration in milliseconds
		const startPos = useCamStore.getState().camRef.position // Get initial position from camRef

		// Convert startPos to an array if it's an object
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
				// set({ camPos: [0, 45, 200] }) // Set camPos to default value
			} else {
				const progress = easeInOutCubic(elapsedTime / duration)
				const newPos = [
					getValueBetween(startArray[0], 0, progress),
					getValueBetween(startArray[1], 40, progress),
					getValueBetween(startArray[2], 200, progress),
				]
				set({ camPos: newPos })
			}
		}

		startTime = Date.now()
		intervalId = setInterval(updateCamPos, 16) // Update every ~16ms for smoother animation
	},
}))

// Easing function for smooth animation
function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Helper function for calculating values between start and end based on progress
function getValueBetween(start, end, progress) {
	progress = Math.max(0, Math.min(1, progress))
	return start + (end - start) * progress
}

// const useCamPosStore = create(set => ({
// 	camPos: [0, 45, 200],
// 	resetCamPos: () => {
// 		const originalPos = [0, 45, 200]
// 		gsap.to(useCamPosStore.getState().camPos, {
// 			duration: 0.5, // Adjust the duration as needed
// 			ease: "power2.inOut", // Easing function for smooth animation
// 			onUpdate: () => {
// 				const currentPos = useCamPosStore.getState().camPos
// 				console.log("Current camPos:", currentPos)
// 				set({ camPos: currentPos })
// 			},
// 			...{ camPos: originalPos },
// 		})
// 	},
// }))

export { useBoxStore, useNoteStore, useCamStore }
