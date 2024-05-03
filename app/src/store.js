import { create } from "zustand"
import { fetchWithToken } from "./requests"
const dbHost = import.meta.env.VITE_DB_HOST
import gsap from "gsap"
import { easePosition, easeNumber } from "./helpers"

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
	setNoteRef: noteRef => {
		set({ noteRef: noteRef })
	},
	isDraggingNote: false,
	setIsDraggingNote: isDragging => {
		set({ isDraggingNote: isDragging })
	},
	notePos: [0, 0.8, 0.39],
	setNotePos: pos => {
		set({ notePos: pos })
	},
	moveNote: endPos => {
		const duration = 250
		const startPos = get().notePos
		const setNotePos = get().setNotePos

		easePosition(startPos, endPos, duration, setNotePos) // Pass the set function to update camPos

		const depth = endPos[2]
		if (depth == 0.39) {
			set({ noteIsFeatured: false })
		} else if (depth == 3.5) {
			set({ noteIsFeatured: true })
		}
	},
	moveNoteY: yPos => {
		if (get().isDraggingNote) return

		set({ notePos: [0, yPos, 0.39] })
	},
	noteIsFeatured: false,
	foldRotationY: 0.2,
	setFoldRotationY: yPos => {
		set({ foldRotationY: yPos })
	},
	openNote: () => {
		set({ foldRotationY: yPos })
	},
	setEaseFoldRotationY: yPos => {
		const startY = get().foldRotationY
		const endY = yPos
		const duration = 250
		const setFoldRotationY = get().setFoldRotationY

		easeNumber(startY, endY, duration, setFoldRotationY)
	},
}))

// In your store or component:
const useCamStore = create((set, get) => ({
	camRef: null,
	setCamRef: camRef => {
		set({ camRef: camRef })
	},
	camPos: [0, 45, 200],
	setCamPos: pos => {
		set({ camPos: pos })
	},
	resetCamPos: () => {
		const duration = 250 // Duration in milliseconds
		const startPos = get().camRef.position // Get initial position from camRef
		const endPos = [0, 45, 200] // Default end position
		const setCamPos = get().setCamPos

		easePosition(startPos, endPos, duration, setCamPos) // Pass the set function to update camPos
	},
}))

export { useBoxStore, useNoteStore, useCamStore }
