import { Canvas, useFrame } from "@react-three/fiber/"
import "./App.css"
import TreasureChest from "./Components/Boxes/TreasureChest"

function Scene() {
	// const directionalLightRef = useRef()
	// useHelper(directionalLightRef, DirectionalLightHelper)

	return (
		<>
			<ambientLight intensity={1.5} />
			<directionalLight position={[0, 0, 2]} intensity={1} />

			<TreasureChest />
		</>
	)
}

function App() {
	return (
		<Canvas>
			<Scene />
		</Canvas>
	)
}

export default App
