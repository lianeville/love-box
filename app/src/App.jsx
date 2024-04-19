import { useEffect, useState } from "react"
import "./App.css"
import ModelViewer from "./ModelViewer"
import useBoxStore from "./store"
import BoxLabel from "./Components/BoxLabel"
import Header from "./Components/Header"
import BoxList from "./Components/BoxList"

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
			<BoxLabel name={boxName} />

			<div className="h-full flex flex-col flex-shrink">
				<ModelViewer />
			</div>

			<BoxList />
		</div>
	)
}

export default App
