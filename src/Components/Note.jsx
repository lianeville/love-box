import { useRef, useState, useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

function Note({ position }) {
	const loader = new GLTFLoader()
	const [scene, setScene] = useState(null)
	const noteRef = useRef(null)

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Note_Folded.glb", gltf => {
			noteRef.current = gltf.scene.children[0]
			console.log(noteRef.current)
			setScene(gltf.scene)
		})
	}, [])

	return (
		<>
			{scene && (
				<primitive
					object={noteRef.current}
					scale={0.5}
					position={position}
				/>
			)}
		</>
	)
}

export default Note
