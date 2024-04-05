import { Canvas, useFrame } from "@react-three/fiber/"
import { useRef, useState, useEffect, useMemo } from "react"
import "./App.css"
import { OrbitControls, useHelper } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useGesture } from "@use-gesture/react"

function TreasureChest() {
	const loader = new GLTFLoader()
	const chestLidRef = useRef(null)
	const chestBaseRef = useRef(null)
	const [scene, setScene] = useState(null)
	const controlsRef = useRef(null)

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Chest_Separated.glb", gltf => {
			const chestGroup = gltf.scene.children[0]

			const lidMesh = chestGroup.children.find(
				child => child.name === "Chest_Lid"
			)
			const baseMesh = chestGroup.children.find(
				child => child.name === "Chest_Base"
			)

			chestLidRef.current = lidMesh
			console.log(chestLidRef.current)
			chestBaseRef.current = baseMesh

			setScene(gltf.scene)
		})
	}, [])

	const handleDragEnd = () => {
		controlsRef.current.enableRotate = true
	}

	const handleDrag = state => {
		controlsRef.current.enableRotate = false
		// Check if chestLidRef is defined before accessing its properties
		if (chestLidRef.current) {
			chestLidRef.current.rotation.x += state.delta[0] * 0.01 // Adjust sensitivity
		}
	}

	const bind = useGesture({ onDrag: handleDrag, onDragEnd: handleDragEnd })

	return (
		<>
			{scene && (
				<>
					<primitive object={chestBaseRef.current} />
					<primitive {...bind()} object={chestLidRef.current} />
					<OrbitControls
						ref={controlsRef}
						enableZoom={false}
						enablePan={false}
					/>
				</>
			)}
		</>
	)
}

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
