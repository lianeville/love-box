import { useRef, useState, useEffect } from "react"
import { OrbitControls } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useGesture } from "@use-gesture/react"
import Note from "../Note"
import gsap from "gsap"
import { RigidBody, CuboidCollider, Physics } from "@react-three/rapier"

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
				x: finalX,
				duration: 0.25,
				ease: "power2.out",
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

			const lookingFromFront = chestAngle > -0.25 && chestAngle < 0.25
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
		const minY = -0.4
		const maxY = 1
		// const maxY = -0.3
		const minZ = 0.4
		const maxZ = 1.3

		return [
			Math.random() * (maxX - minX) + minX,
			Math.random() * (maxY - minY) + minY,
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
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<primitive object={chestBaseRef.current} />
					<primitive {...bind()} object={chestLidRef.current} />
					<OrbitControls ref={controlsRef} enableZoom={true} />
				</>
			)}
		</>
	)
}

export default TreasureChest
