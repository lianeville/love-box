import { useEffect, useState, useRef } from "react"
import { Canvas } from "@react-three/fiber/"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { Physics } from "@react-three/rapier"
import { PerspectiveCamera } from "@react-three/drei"
import { useBoxStore, useCamStore } from "./store"

function ModelViewer() {
	const { activeBox, loadBox } = useBoxStore()
	const [noteCount, setNoteCount] = useState(0)
	const perspectiveCamRef = useRef(null)
	const { camPos, setCamRef } = useCamStore()

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
				ref={setCamRef}
				near={1}
				far={2000}
				position={camPos}
				isPerspectiveCamera={true}
			/>
		</Canvas>
	)
}

export default ModelViewer
