import { Canvas, useFrame } from "@react-three/fiber/"
import "./App.css"
import TreasureChest from "./Components/Boxes/TreasureChest"
import { useGLTF, OrbitControls, Stage, Sphere, Plane } from "@react-three/drei"
import { RigidBody, Physics } from "@react-three/rapier"
import * as THREE from "three"

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

function Ball(props) {
	return (
		<RigidBody colliders="ball" type="dynamic">
			<Sphere args={[0.01, 8, 8]} position={props.position}></Sphere>
		</RigidBody>
	)
}

// function ChestCollider(props) {
// 	return (
// 		<RigidBody colliders="hull" type="fixed">
// 			<Plane
// 				rotation-x={-Math.PI / 2}
// 				args={[0.1, 0.1]}
// 				position={[0, 0, 0]}
// 				material-color="hotpink"
// 				material-side={THREE.DoubleSide}
// 			></Plane>
// 			<Plane
// 				args={[0.075, 0.04]}
// 				position={[0, 0.02, 0.03]}
// 				material-color="hotpink"
// 				material-side={THREE.DoubleSide}
// 			></Plane>
// 			<Plane
// 				args={[0.075, 0.04]}
// 				position={[0, 0.02, -0.03]}
// 				material-color="hotpink"
// 				material-side={THREE.DoubleSide}
// 			></Plane>
// 			<Plane
// 				args={[0.075, 0.04]}
// 				position={[-0.03, 0.02, 0]}
// 				material-color="hotpink"
// 				material-side={THREE.DoubleSide}
// 			></Plane>
// 		</RigidBody>
// 	)
// }

// function Track(props) {
// 	const { nodes } = useGLTF("/src/assets/3D-Models/Chest_Separated.glb")
// 	// console.log(nodes)
// 	return (
// 		<RigidBody colliders="hull" type="fixed">
// 			<mesh
// 				geometry={nodes.Chest_Base.geometry}
// 				{...props}
// 				dispose={null}
// 				scale={[5, 5, 5]}
// 			>
// 				<meshPhysicalMaterial
// 					color="lightblue"
// 					transmission={1}
// 					thickness={1}
// 					roughness={0}
// 				/>
// 			</mesh>
// 		</RigidBody>
// 	)
// }

function App() {
	return (
		<Canvas>
			<Scene />
		</Canvas>
	)
}

export default App
