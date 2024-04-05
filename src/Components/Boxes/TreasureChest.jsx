import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber/"

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
			console.log(chestLidRef.current.rotation.x)
			chestBaseRef.current = baseMesh

			setScene(gltf.scene)
		})
	}, [])

	const handleDragEnd = () => {
		controlsRef.current.enableRotate = true
	}

	const handleDrag = state => {
		controlsRef.current.enableRotate = false

		if (chestLidRef.current) {
			const min = -1
			const max = 0.95
			const lid = chestLidRef.current.rotation
			const chestAngle = controlsRef.current.getAzimuthalAngle()

			let rotation = state.delta[0] * 0.01
			if (chestAngle > 0) {
				rotation = -rotation
			}

			const newRotationX = Math.min(Math.max(lid.x + rotation, min), max)
			lid.x = newRotationX
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
						// enableZoom={false}
						// enablePan={false}
					/>
				</>
			)}
		</>
	)
}

export default TreasureChest
