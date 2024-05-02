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

const useNoteStore = create((set, get) => ({
	noteRef: null,
	isDraggingNote: false,
	notePos: [0, 0.8, 0.39],
	setNoteRef: noteRef => {
		set({ noteRef: noteRef })
	},
	setIsDraggingNote: isDragging => {
		if (isDragging) {
			console.log("dragging.")
		} else {
			console.log("no longer dragging")
		}
		set({ isDraggingNote: isDragging })
	},
	setNotePos: endPos => {
		// if (get().isDraggingNote) return

		const duration = 250
		const startPos = get().notePos

		easePosition(startPos, endPos, duration, set, "notePos") // Pass the set function to update camPos

		// setInterval(() => {
		// 	console.log("setNotePosAfter", get().notePos)
		// }, 100)
	},
	setNotePosY: yPos => {
		if (get().isDraggingNote) return
		// console.log("isDraggingNote", get().isDraggingNote)
		// console.log("setting Y:")
		set({ notePos: [0, yPos, 0.39] })
	},
}))

// In your store or component:
const useCamStore = create((set, get) => ({
	camRef: null,
	camPos: [0, 45, 200],
	setCamRef: camRef => {
		set({ camRef: camRef })
	},
	resetCamPos: () => {
		const duration = 250 // Duration in milliseconds
		const startPos = get().camRef.position // Get initial position from camRef
		const endPos = [0, 45, 200] // Default end position

		easePosition(startPos, endPos, duration, set, "camPos") // Pass the set function to update camPos
	},
}))

export { useBoxStore, useNoteStore, useCamStore }
