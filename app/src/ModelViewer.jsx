import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber/"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { Physics } from "@react-three/rapier"
import { OrthographicCamera, PerspectiveCamera, Html } from "@react-three/drei"
import BoxLabel from "./Components/BoxLabel"
import useBoxStore from "./store"

function ModelViewer() {
	const { activeBox, loadBox } = useBoxStore()
	const [noteCount, setNoteCount] = useState(0)
	const [boxName, setBoxName] = useState("")

	useEffect(() => {
		loadBox("6619e6838f8673bd5fd0a994")
	}, [])

	useEffect(() => {
		if (activeBox == null) return
		setNoteCount(activeBox.receiver_notes.length)
		setBoxName(activeBox.name_by_creator)
	}, [activeBox])

	return (
		<Canvas>
			<ambientLight intensity={1.5} />
			<directionalLight position={[0, 0, 2]} intensity={1} />

			{/* <Html position={[0, 2.5, 1]} transform={true} sprite={true}>
				<BoxLabel name={boxName} />
			</Html> */}

			<Physics>
				<TreasureChest noteCount={noteCount} />
			</Physics>

			<PerspectiveCamera
				makeDefault
				fov={70}
				zoom={1}
				near={1}
				far={2000}
				position={[0, 0, 200]}
				isPerspectiveCamera={true}
			/>
			{/* <OrthographicCamera
				makeDefault
				zoom={100}
				near={1}
				far={2000}
				position={[0, 0, 200]}
			/> */}
		</Canvas>
	)
}

export default ModelViewer
