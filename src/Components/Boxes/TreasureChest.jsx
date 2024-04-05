import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber/"

import { OrbitControls, useHelper } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useGesture } from "@use-gesture/react"
import gsap from "gsap"

function TreasureChest() {
	const loader = new GLTFLoader()
	const chestLidRef = useRef(null)
	const chestBaseRef = useRef(null)
	const [scene, setScene] = useState(null)
	const controlsRef = useRef(null)
	const lidMinX = -1
	const lidMaxX = 0.95
	let dragInitialX = lidMaxX

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
			chestBaseRef.current = baseMesh

			setScene(gltf.scene)
		})
	}, [])

	function checkLidRotation() {
		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation

			let finalX = 0
			if (dragInitialX > -1) {
				// Lid starts from closed
				finalX = lid.x > 0.55 ? lidMaxX : lidMinX
			} else {
				// Lid starts from open
				finalX = lid.x > -0.55 ? lidMaxX : lidMinX
			}

			gsap.to(lid, {
				x: finalX, // Set the final position
				duration: 0.25, // Set the duration of the animation to 0.5 seconds
				ease: "power2.out", // Add easing for a smoother animation (optional)
			})
		}
	}

	function handleDragStart() {
		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation
			dragInitialX = lid.x
		}
	}

	function handleDragEnd(event) {
		controlsRef.current.enableRotate = true
		checkLidRotation()
	}

	function handleDrag(state) {
		controlsRef.current.enableRotate = false

		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation
			const chestAngle = controlsRef.current.getAzimuthalAngle()

			let rotation = state.delta[0] * 0.01
			if (chestAngle > 0) {
				rotation = -rotation
			}

			const intermediateValue = Math.max(lid.x + rotation, lidMinX)
			const newRotationX = Math.min(intermediateValue, lidMaxX)
			lid.x = newRotationX
		}
	}

	const bind = useGesture({
		onDrag: handleDrag,
		onDragStart: handleDragStart,
		onDragEnd: handleDragEnd,
	})

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
