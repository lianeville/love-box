import { create } from "zustand"
import { fetchWithToken } from "./requests"
const dbHost = import.meta.env.VITE_DB_HOST
import gsap from "gsap"
import easePosition from "./helpers"

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
	setIsDraggingNote: isDragging => {
		set({ isDraggingNote: isDragging })
		if (isDragging) {
			// useCamStore.getState().camRef.enableRotate = false
		} else {
			// useCamStore.getState().camRef.enableRotate = true
		}
	},
}))

// In your store or component:
const useCamStore = create(set => ({
	camRef: null,
	camPos: [0, 45, 200],
	setCamRef: camRef => {
		set({ camRef: camRef })
	},
	resetCamPos: () => {
		const duration = 250 // Duration in milliseconds
		const startPos = useCamStore.getState().camRef.position // Get initial position from camRef
		const endPos = [0, 45, 200] // Default end position

		easePosition(startPos, endPos, duration, set, "camPos") // Pass the set function to update camPos
	},
}))

export { useBoxStore, useNoteStore, useCamStore }
