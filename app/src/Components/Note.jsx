import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"

function getRandomPositions(position) {
	// const { minX, minY, minZ, maxX, maxY, maxZ } = positions
	// return [0, -0.33, 1]
	// return [
	// 	Math.random() * (maxX - minX) + minX,
	// 	Math.random() * (maxY - minY) + minY,
	// 	Math.random() * (maxZ - minZ) + minZ,
	// ]
}

// function getRandomRotation() {
// 	return [0, Math.random() * Math.PI * 2, 0]
// }

function noteClick() {
	console.log("hi")
}

function Note({ position }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteRef = useRef(null)

	// positions = getRandomPositions(positions)

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Folded.glb", gltf => {
			noteRef.current = gltf.scene.children[0]
			setScene(gltf.scene)
		})
	}, [])

	return (
		<>
			{scene && (
				<RigidBody colliders="hull" gravityScale={10}>
					<primitive
						position={position}
						object={noteRef.current}
						scale={0.5}
						onClick={noteClick}
						// rotation={getRandomRotation()}
					/>
				</RigidBody>
			)}
		</>
	)
}

export default Note
