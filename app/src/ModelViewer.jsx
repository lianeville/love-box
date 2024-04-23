import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber/"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { Physics } from "@react-three/rapier"
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei"
import { useBoxStore } from "./store"

function ModelViewer() {
	const { activeBox, loadBox } = useBoxStore()
	const [noteCount, setNoteCount] = useState(0)

	useEffect(() => {
		loadBox("6619e6838f8673bd5fd0a994")
	}, [])

	useEffect(() => {
		if (activeBox == null) return
		setNoteCount(activeBox.receiver_notes.length)
	}, [activeBox])

	return (
		<Canvas>
			<ambientLight intensity={1.5} />
			<directionalLight position={[0, 0, 2]} intensity={1} />

			<Physics>
				<TreasureChest noteCount={noteCount} />
			</Physics>

			<PerspectiveCamera
				makeDefault
				zoom={0.55}
				near={1}
				far={2000}
				position={[0, 0, 200]}
				isPerspectiveCamera={true}
			/>
		</Canvas>
	)
}

export default ModelViewer
