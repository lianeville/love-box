import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"
import { useGesture } from "@use-gesture/react"
import { useNoteStore, useCamStore } from "../store"
import { easeNumber } from "../helpers"
import gsap from "gsap"

function NotePrimary({ setCanRotateCam, innerRef }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteLeftRef = useRef(null)
	const noteRightRef = useRef(null)
	const {
		setIsDraggingNote,
		notePos,
		moveNote,
		foldRotationY,
		setFoldRotationY,
		setEaseFoldRotationY,
	} = useNoteStore()

	// const [rotation, setRotation] = useState([0, 0, 0])
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

			// const note = noteRightRef.current.rotation

			let rotation = (event.delta[0] *= 0.045)
			rotation = -rotation

			const leftMostValue = Math.min(
				foldRotationY + rotation,
				leftMostNoteX + 0.25
			)
			const newRotationX = Math.max(leftMostValue, rightMostNoteX - 0.25)

			setFoldRotationY(newRotationX)
		},
		onDragStart: event => {},
		onDragEnd: () => {
			setCanRotateCam(true)
			checkNoteRotation()
		},
	})

	function checkNoteRotation() {
		let open = foldRotationY > 1.5

		let finalY = rightMostNoteX
		if (open) {
			finalY = leftMostNoteX
			resetCamPos()
			featureNote()
		} else {
			dismissNote()
		}

		setEaseFoldRotationY(finalY)
		// gsap.to(note, {
		// 	y: finalY,
		// 	duration: 0.25,
		// 	ease: "power2.out",
		// })
	}

	function featureNote() {
		const endPos = [0, 0.8, 3.5]
		moveNote(endPos)
	}

	function dismissNote() {
		const endPos = [0, 0.8, 0.39]
		moveNote(endPos)
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
				<group ref={innerRef} position={notePos} scale={0.9}>
					<group>
						<primitive object={noteLeftRef.current} />

						<group
							onPointerDown={checkIntersections}
							onPointerUp={disableDragging}
							onPointerOut={disableDragging}
						>
							<primitive
								{...gestures()}
								rotation-y={foldRotationY}
								object={noteRightRef.current}
							/>
						</group>
					</group>
				</group>
			)}
		</>
	)
}

export default NotePrimary
