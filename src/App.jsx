import { Canvas, useFrame } from "@react-three/fiber/"
import "./App.css"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { Physics } from "@react-three/rapier"
import { Suspense } from "react"
import { Box, Torus } from "@react-three/drei"

function Scene() {
	return (
		<>
			<ambientLight intensity={1.5} />
			<directionalLight position={[0, 0, 2]} intensity={1} />

			{/* <RigidBody colliders={"hull"} restitution={2}>
				<Torus />
			</RigidBody>
			<CuboidCollider position={[0, -2, 0]} args={[20, 0.5, 20]} /> */}

			<TreasureChest />
		</>
	)
}

function App() {
	return (
		<Canvas>
			<Suspense>
				<Physics>
					<Scene />
				</Physics>
			</Suspense>
		</Canvas>
	)
}

export default App
