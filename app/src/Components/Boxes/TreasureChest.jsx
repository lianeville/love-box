import React, { useRef, useState, useEffect, memo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useGesture } from "@use-gesture/react"
import gsap from "gsap"
import { OrbitControls, PivotControls, DragControls } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import NotePrimary from "../NotePrimary"

import Note from "../Note"
import ChestCollider from "../Colliders/ChestCollider"

function TreasureChest({ noteCount }) {
	const loader = new GLTFLoader()
	const chestLidRef = useRef(null)
	const chestBaseRef = useRef(null)
	const [scene, setScene] = useState(null)
	const controlsRef = useRef(null)
	const lidMinX = -1
	const lidMaxX = 0.95
	const [primaryNotePos, setPrimaryNotePos] = useState(dampenY(lidMinX))
	const [dragInitialX, setDragInitialX] = useState(lidMaxX)

	useEffect(() => {
		loadModels()
	}, [])

	function dampenY(y) {
		const alpha = 0.4
		const dampenedY = alpha * y + (1 - alpha) - 0.2
		return dampenedY
	}

	function loadModels() {
		loader.load("/src/assets/3D-Models/Chest_Separated.glb", gltf => {
			const chestGroup = gltf.scene.children[0].children

			chestLidRef.current = chestGroup[1]
			chestBaseRef.current = chestGroup[0]

			setScene(gltf.scene)
		})
	}

	function checkLidRotation() {
		const lid = chestLidRef.current.rotation
		const isStartingFromClosed = dragInitialX > -1

		let finalX = 0
		if (isStartingFromClosed) {
			finalX = lid.x > 0.65 ? lidMaxX : lidMinX
		} else {
			finalX = lid.x > -0.65 ? lidMaxX : lidMinX
		}

		gsap.to(lid, {
			x: finalX,
			duration: 0.25,
			ease: "power2.out",
			onUpdate: () => {
				setPrimaryNotePos(dampenY(-lid.x))
			},
		})
	}

	const lidGestures = useGesture({
		onDrag: event => {
			controlsRef.current.enableRotate = false

			const lid = chestLidRef.current.rotation
			const chestAngle = controlsRef.current.getAzimuthalAngle()

			const lookingFromFront = chestAngle > -0.35 && chestAngle < 0.35
			const lookingFromRight = chestAngle > 0

			let rotation = event.delta[0]
			if (lookingFromFront) {
				rotation = event.delta[1]
			} else if (lookingFromRight) {
				rotation = -rotation
			}
			rotation *= 0.0075

			const intermediateValue = Math.max(lid.x + rotation, lidMinX)
			const newRotationX = Math.min(intermediateValue, lidMaxX)
			lid.x = newRotationX
			setPrimaryNotePos(dampenY(-newRotationX))
		},
		onDragStart: () => {
			const lid = chestLidRef.current.rotation
			setDragInitialX(lid.x)
		},
		onDragEnd: () => {
			controlsRef.current.enableRotate = true
			checkLidRotation()
		},
	})

	return (
		<>
			{scene && (
				<>
					<group scale={[40, 40, 40]}>
						{Array.from({ length: noteCount }, (_, index) => (
							<Note key={index} position={[0, -0.33, 1]} />
						))}

						<RigidBody colliders={"hull"} type="fixed">
							<ChestCollider />
						</RigidBody>

						<NotePrimary positionY={primaryNotePos} />

						<primitive object={chestBaseRef.current} />
						<primitive {...lidGestures()} object={chestLidRef.current} />

						<OrbitControls
							target={[0, 0, 33]}
							ref={controlsRef}
							enableZoom={true}
						/>
					</group>
				</>
			)}
		</>
	)
}

export default TreasureChest
