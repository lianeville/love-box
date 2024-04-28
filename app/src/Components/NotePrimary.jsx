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
	// let position = []
	const [isAttachedToCam, setIsAttachedToCam] = useState(false)
	const [position, setPosition] = useState([0, positionY, 0.39])
	const [rotation, setRotation] = useState([0, 0, 0])

	const leftMostNoteX = 3
	const rightMostNoteX = 0.2

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Separated.glb", gltf => {
			noteLeftRef.current = gltf.scene.children[0]
			noteRightRef.current = gltf.scene.children[1]
			setScene(gltf.scene)
		})
	}, [])

	// useEffect(() => {
	// 	console.log(position)
	// }, [position])

	useEffect(() => {
		setPosition([0, positionY, 0.39])
	}, [positionY])

	const gestures = useGesture({
		onDrag: event => {
			cameraRef.current.enableRotate = false

			const note = noteRightRef.current.rotation

			let rotation = (event.delta[0] *= 0.022)
			rotation = -rotation

			const leftMostValue = Math.min(note.y + rotation, leftMostNoteX + 0.25)
			const newRotationX = Math.max(leftMostValue, rightMostNoteX - 0.25)

			note.y = newRotationX
		},
		onDragStart: event => {
			// console.log(cameraRef.current.object)
		},
		onDragEnd: () => {
			cameraRef.current.enableRotate = true
			const note = noteRightRef.current.rotation
			checkNoteRotation(note)
		},
	})

	function checkNoteRotation(note) {
		let open = note.y > 1.5

		let finalY = rightMostNoteX
		if (open) {
			finalY = leftMostNoteX
		}

		gsap.to(note, {
			y: finalY,
			duration: 0.25,
			ease: "power2.out",
		})
	}

	function rotatePositionNote() {
		const camera = cameraRef.current.object
		const filmGauge = camera.filmGauge
		const fov = camera.fov
		const position = camera.position

		const azi = cameraRef.current.getAzimuthalAngle()
		const polar = cameraRef.current.getPolarAngle()

		console.log("azi", azi)
		console.log("polar", polar)

		let xRotate = rotation[0]
		let yRotate = rotation[1]
		let zRotate = rotation[2]
		// const rotation = [xRotate, yRotate, zRotate]

		yRotate += 0.1
		console.log(yRotate)

		const finalRotate = [xRotate, yRotate, zRotate]

		setRotation(finalRotate)

		const x = position.x / fov
		const y = position.y / fov
		const z = position.z / fov

		const cameraPos = [x, y, z]
		setPosition(cameraPos)
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
					position={position}
					// rotation={[0, Math.PI * 0.8, Math.PI / 2]}
					scale={0.9}
					// onClick={rotatePositionNote}
				>
					<group rotation={rotation}>
						<primitive object={noteLeftRef.current} />

						<group
							onPointerDown={checkIntersections}
							onPointerUp={disableDragging}
						>
							<primitive {...gestures()} object={noteRightRef.current} />
						</group>
					</group>
				</group>
			)}
		</>
	)
}

export default NotePrimary
