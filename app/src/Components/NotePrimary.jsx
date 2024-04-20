import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RigidBody } from "@react-three/rapier"

function NotePrimary({ positionY }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteLeftRef = useRef(null)
	const noteRightRef = useRef(null)

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Separated.glb", gltf => {
			noteLeftRef.current = gltf.scene.children[0]
			noteRightRef.current = gltf.scene.children[1]
			setScene(gltf.scene)
		})
	}, [])

	return (
		<>
			{scene && (
				<RigidBody
					colliders="hull"
					gravityScale={10}
					position={[0, positionY, 0.39]}
					rotation={[0, Math.PI * 0.8, Math.PI / 2]}
					scale={1}
				>
					<primitive
						object={noteLeftRef.current}
						// scale={0.5}
						// onClick={noteClick}
						// rotation={getRandomRotation()}
					/>
					<primitive
						// position={position}
						object={noteRightRef.current}
						// scale={0.5}
						// onClick={noteClick}
						// rotation={getRandomRotation()}
					/>
				</RigidBody>
			)}
		</>
	)
}

export default NotePrimary
