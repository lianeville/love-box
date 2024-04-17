import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"

function getRandomPositions(positions) {
	const minX = positions[0]
	const maxX = positions[1]
	const minY = positions[2]
	const maxY = positions[3]
	const minZ = positions[4]
	const maxZ = positions[5]

	return [
		Math.random() * (maxX - minX) + minX,
		Math.random() * (maxY - minY) + minY,
		Math.random() * (maxZ - minZ) + minZ,
	]
}

function getRandomRotation() {
	return [
		Math.random() * Math.PI * 2,
		Math.random() * Math.PI * 2,
		Math.random() * Math.PI * 2,
	]
}

function noteClick() {
	console.log("hi")
}

function Note({ positions }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteRef = useRef(null)

	positions = getRandomPositions(positions)

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Folded.glb", gltf => {
			noteRef.current = gltf.scene.children[0]
			setScene(gltf.scene)
		})
	}, [])

	return (
		<>
			{scene && (
				<RigidBody colliders="hull" type="dynamic" gravityScale={5}>
					<primitive
						position={positions}
						object={noteRef.current}
						scale={0.5}
						onClick={noteClick}
						rotation={getRandomRotation()}
					/>
				</RigidBody>
			)}
		</>
	)
}

export default Note
