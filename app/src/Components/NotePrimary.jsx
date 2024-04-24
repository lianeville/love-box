import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"
import { useGesture } from "@use-gesture/react"
import { useNoteStore } from "../store"
import gsap from "gsap"

function NotePrimary({ positionY, cameraRef }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteLeftRef = useRef(null)
	const noteRightRef = useRef(null)
	const { isDraggingNote, setIsDraggingNote } = useNoteStore()

	const leftMostNoteX = -2.25
	const rightMostNoteX = 0.25

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Separated.glb", gltf => {
			noteLeftRef.current = gltf.scene.children[0]
			noteRightRef.current = gltf.scene.children[1]
			setScene(gltf.scene)
		})
	}, [])

	const gestures = useGesture({
		onDrag: event => {
			cameraRef.current.enableRotate = false

			const note = noteRightRef.current.rotation

			let rotation = (event.delta[0] *= 0.022)

			const intermediateValue = Math.max(
				note.x + rotation,
				leftMostNoteX - 0.25
			)
			const newRotationX = Math.min(intermediateValue, rightMostNoteX)

			note.x = newRotationX
		},
		onDragStart: event => {},
		onDragEnd: () => {
			cameraRef.current.enableRotate = true
			const note = noteRightRef.current.rotation
			checkNoteRotation(note)
		},
	})

	function checkNoteRotation(note) {
		let finalX = note.x < -1.5 ? leftMostNoteX : rightMostNoteX - 0.25

		gsap.to(note, {
			x: finalX,
			duration: 0.25,
			ease: "power2.out",
		})
	}

	function checkIntersections(e) {
		const closestMesh = e.intersections[0].object.name
		if (closestMesh == "PlaneRight") setIsDraggingNote(true)
	}

	function disableDragging() {
		setIsDraggingNote(false)
	}

	return (
		<>
			{scene && (
				<group
					position={[0, positionY, 0.39]}
					rotation={[0, Math.PI * 0.8, Math.PI / 2]}
					scale={0.9}
				>
					<primitive object={noteLeftRef.current} />

					<group
						onPointerDown={checkIntersections}
						onPointerUp={disableDragging}
					>
						<primitive {...gestures()} object={noteRightRef.current} />
					</group>
				</group>
			)}
		</>
	)
}

export default NotePrimary
