import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"
import { useGesture } from "@use-gesture/react"
import { useNoteStore, useCamStore } from "../store"
import easePosition from "../helpers"
import gsap from "gsap"

function NotePrimary({ setCanRotateCam, innerRef }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteLeftRef = useRef(null)
	const noteRightRef = useRef(null)
	const { setIsDraggingNote, notePos, setNotePos } = useNoteStore()

	const [rotation, setRotation] = useState([0, 0, 0])
	const { resetCamPos } = useCamStore()

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
	// 	setPosition([0, positionY, 0.39])
	// }, [positionY])

	const gestures = useGesture({
		onDrag: event => {
			setCanRotateCam(false)

			const note = noteRightRef.current.rotation

			let rotation = (event.delta[0] *= 0.022)
			rotation = -rotation

			const leftMostValue = Math.min(note.y + rotation, leftMostNoteX + 0.25)
			const newRotationX = Math.max(leftMostValue, rightMostNoteX - 0.25)

			note.y = newRotationX
		},
		onDragStart: event => {},
		onDragEnd: () => {
			setCanRotateCam(true)
			const note = noteRightRef.current.rotation
			checkNoteRotation(note)
		},
	})

	function checkNoteRotation(note) {
		let open = note.y > 1.5

		let finalY = rightMostNoteX
		if (open) {
			finalY = leftMostNoteX
			// resetCamPos()
			featureNote()
		} else {
			dismissNote()
		}

		gsap.to(note, {
			y: finalY,
			duration: 0.25,
			ease: "power2.out",
		})
	}

	function featureNote() {
		const endPos = [0, 0.8, 3.5]
		setNotePos(endPos)
	}

	function dismissNote() {
		const endPos = [0, 0.8, 0.39]
		setNotePos(endPos)
	}

	function checkIntersections(e) {
		const closestMesh = e.intersections[0].object.name
		if (closestMesh == "PlaneRight") {
			setIsDraggingNote(true)
		}
	}

	function disableDragging() {
		setTimeout(() => {
			setIsDraggingNote(false)
		}, 200)
	}

	return (
		<>
			{scene && (
				<group
					ref={innerRef}
					position={notePos}
					// rotation={[0, Math.PI * 0.8, Math.PI / 2]}
					scale={0.9}
					// onClick={rotatePositionNote}
				>
					<group rotation={rotation}>
						<primitive object={noteLeftRef.current} />

						<group
							onPointerDown={checkIntersections}
							onPointerUp={disableDragging}
							onPointerOut={disableDragging}
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
