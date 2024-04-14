import { useEffect } from "react"
import "./App.css"
import ModelViewer from "./ModelViews"
import useBoxStore from "./store"

function App() {
	const { activeBox, loadBox } = useBoxStore()
	let noteCount = 0

	// useEffect(() => {
	// 	loadBox("6619e6838f8673bd5fd0a994")
	// }, [])

	// useEffect(() => {
	// 	console.log(activeBox)
	// 	noteCount = activeBox.receiver_notes.length
	// }, [activeBox])

	return (
		<div className="h-full flex">
			<ModelViewer />
		</div>
	)
}

export default App
