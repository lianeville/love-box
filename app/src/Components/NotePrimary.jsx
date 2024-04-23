import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"
import { useGesture } from "@use-gesture/react"
import { useNoteStore } from "../store"

function NotePrimary({ positionY }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteLeftRef = useRef(null)
	const noteRightRef = useRef(null)
	const { isDraggingNote, setIsDraggingNote } = useNoteStore()

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Separated.glb", gltf => {
			noteLeftRef.current = gltf.scene.children[0]
			noteRightRef.current = gltf.scene.children[1]
			setScene(gltf.scene)
		})
	}, [])

	useEffect(() => {
		console.log("isDraggingNote", isDraggingNote)
	}, [isDraggingNote])

	const gestures = useGesture({
		onDrag: event => {
			// console.log("dragging")
		},
		onDragStart: event => {},
		onDragEnd: () => {},
	})

	function checkIntersections(e) {
		// console.log(e.intersections)
		// setIsDraggingNote(false)
		// console.log(isDraggingNote)
		// let planeDistance = 0
		// let chestDistance = Infinity
		// console.log(e.intersections[0].object.name)
		const closestMesh = e.intersections[0].object.name
		if (closestMesh == "PlaneRight") setIsDraggingNote(true)
		// e.intersections.forEach(mesh => {
		// 	console.log(mesh.object.name)
		// 	// if (mesh.object.name == "Chest_Lid") {
		// 	// 	chestDistance =
		// 	// }
		// })
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
