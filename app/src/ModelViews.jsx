import { Canvas } from "@react-three/fiber/"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { Physics } from "@react-three/rapier"
import { OrthographicCamera } from "@react-three/drei"

// function Scene() {
// 	return (
// 		<>
// 		</>
// 	)
// }

function ModelViewer() {
	return (
		<Canvas>
			<ambientLight intensity={1.5} />
			<directionalLight position={[0, 0, 2]} intensity={1} />

			<Physics>
				<TreasureChest />
			</Physics>

			<OrthographicCamera
				makeDefault
				zoom={100}
				near={1}
				far={2000}
				position={[0, 0, 200]}
			/>
		</Canvas>
	)
}

export default ModelViewer
