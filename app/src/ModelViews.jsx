import { Canvas } from "@react-three/fiber/"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { Physics } from "@react-three/rapier"

function Scene() {
	return (
		<>
			<ambientLight intensity={1.5} />
			<directionalLight position={[0, 0, 2]} intensity={1} />

			<Physics>
				<TreasureChest />
			</Physics>
		</>
	)
}

function ModelViewer() {
	return (
		<Canvas>
			<Scene />
		</Canvas>
	)
}

export default ModelViewer
