import { Canvas, useFrame } from "@react-three/fiber/"
import { useRef, useState, useEffect, useMemo } from "react"
import "./App.css"
import { MeshWobbleMaterial, OrbitControls, useHelper } from "@react-three/drei"
import { DirectionalLightHelper } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

function TreasureChest() {
	const loader = new GLTFLoader()
	const chestLidRef = useRef(null)
	const chestBaseRef = useRef(null)
	const [scene, setScene] = useState(null)

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Chest_Separated.glb", gltf => {
			const chestGroup = gltf.scene.children[0] // Assuming the first child is the group

			const lidMesh = chestGroup.children.find(
				child => child.name === "Chest_Lid"
			) // Assuming names
			const baseMesh = chestGroup.children.find(
				child => child.name === "Chest_Base"
			)

			chestLidRef.current = lidMesh
			chestBaseRef.current = baseMesh

			setScene(gltf.scene) // Set the entire scene for context
		})
	}, []) // Empty dependency array to run only once

	const handleLidOpen = () => {
		// Implement logic to adjust chestLidRef.current.position.y when opening
		// Example:
		if (chestLidRef.current) {
			console.log("hi")
			chestLidRef.current.position.y += 0.5 // Adjust Y position for opening animation
		}
	}

	return (
		<>
			{scene && (
				<>
					<primitive object={chestBaseRef.current} />
					<primitive
						object={chestLidRef.current}
						onClick={handleLidOpen}
					/>
				</>
			)}
		</>
	)
}

// function Sphere({ position, size, color }) {
// 	const ref = useRef()

// 	const [isHovered, setIsHovered] = useState(false)
// 	const [isClicked, setIsClicked] = useState(false)

// 	useFrame((state, delta) => {
// 		const speed = isHovered ? 1 : 0.5
// 		ref.current.rotation.y += delta * speed
// 	})

// 	return (
// 		<mesh
// 			position={position}
// 			ref={ref}
// 			onPointerEnter={event => (event.stopPropagation, setIsHovered(true))}
// 			onPointerLeave={() => setIsHovered(false)}
// 			onClick={() => setIsClicked(!isClicked)}
// 			scale={isClicked ? 1.5 : 1}
// 		>
// 			<sphereGeometry args={size} />
// 			<meshStandardMaterial
// 				color={isHovered ? "orange" : "lightblue"}
// 				wireframe
// 			/>
// 		</mesh>
// 	)
// }

function Scene() {
	const directionalLightRef = useRef()
	useHelper(directionalLightRef, DirectionalLightHelper)

	return (
		<>
			<ambientLight intensity={1.5} />
			<directionalLight
				// ref={directionalLightRef}
				position={[0, 0, 2]}
				intensity={1}
			/>

			<TreasureChest />
			<OrbitControls enableZoom={false} />
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
