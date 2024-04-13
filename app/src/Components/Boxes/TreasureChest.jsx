import { useRef, useState, useEffect } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useGesture } from "@use-gesture/react"
import gsap from "gsap"
import { OrbitControls } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

import Note from "../Note"
import ChestCollider from "../Colliders/ChestCollider"

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
			const chestGroup = gltf.scene.children[0].children

			chestLidRef.current = chestGroup[1]
			chestBaseRef.current = chestGroup[0]

			setScene(gltf.scene)
		})
	}, [])

	function checkLidRotation() {
		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation
			const isStartingFromClosed = dragInitialX > -1

			let finalX = 0
			if (isStartingFromClosed) {
				finalX = lid.x > 0.55 ? lidMaxX : lidMinX
			} else {
				finalX = lid.x > -0.55 ? lidMaxX : lidMinX
			}

			gsap.to(lid, {
				x: finalX,
				duration: 0.25,
				ease: "power2.out",
			})
		}
	}

	function handleDragStart() {
		const lid = chestLidRef.current.rotation
		dragInitialX = lid.x
	}

	function handleDragEnd() {
		controlsRef.current.enableRotate = true
		checkLidRotation()
	}

	function handleDrag(state) {
		controlsRef.current.enableRotate = false

		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation
			const chestAngle = controlsRef.current.getAzimuthalAngle()

			const lookingFromFront = chestAngle > -0.35 && chestAngle < 0.35
			const lookingFromRight = chestAngle > 0

			let rotation = state.delta[0] * 0.01
			if (lookingFromFront) {
				rotation = state.delta[1] * 0.01
			} else if (lookingFromRight) {
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

	function getRandomPositionInChestBase() {
		const minX = -0.5
		const maxX = 0.5
		// const minY = -0.2
		// const maxY = -0.2
		const minZ = 0.4
		const maxZ = 1.3

		return [
			Math.random() * (maxX - minX) + minX,
			-0.2,
			Math.random() * (maxZ - minZ) + minZ,
		]
	}

	return (
		<>
			{scene && (
				<>
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<RigidBody colliders={"hull"} type="fixed">
						<ChestCollider />
					</RigidBody>
					<primitive object={chestBaseRef.current} />

					<primitive {...bind()} object={chestLidRef.current} />
					<OrbitControls ref={controlsRef} enableZoom={true} />
				</>
			)}
		</>
	)
}

export default TreasureChest