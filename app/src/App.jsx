import { useEffect, useState } from "react"
import "./App.css"
import ModelViewer from "./ModelViewer"
import useBoxStore from "./store"
import BoxLabel from "./Components/BoxLabel"
import Header from "./Components/Header"

function App() {
	const { activeBox, loadBox } = useBoxStore()
	let [boxName, setBoxName] = useState("")

	useEffect(() => {
		loadBox("6619e6838f8673bd5fd0a994")
	}, [])

	useEffect(() => {
		if (activeBox == null) return
		console.log(activeBox)
		setBoxName(activeBox.name_by_creator)
	}, [activeBox])

	return (
		<div className="h-full flex flex-col">
			<Header />
			<div className="h-0 z-10 flex justify-center">
				<span className="static mt-5 text-5xl">{boxName}</span>
			</div>

			<div className="h-full flex flex-col">
				<ModelViewer />
			</div>

			<div className="pb-6 fixed bottom-0 left-1/2 right-1/2">
				<div className="h-10 w-10 bg-slate-200"></div>
			</div>
		</div>
	)
}

export default App
