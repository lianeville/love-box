import { create } from "zustand"
const dbHost = import.meta.env.VITE_DB_HOST

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
	//
}))

export default useBoxStore
