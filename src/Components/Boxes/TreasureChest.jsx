import { useRef, useState, useEffect } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useGesture } from "@use-gesture/react"
import Note from "../Note"
import gsap from "gsap"
import { useGLTF, OrbitControls, Stage, Sphere, Plane } from "@react-three/drei"
import * as THREE from "three"
import { RigidBody } from "@react-three/rapier"

function TreasureChest() {
	const loader = new GLTFLoader()
	const chestLidRef = useRef(null)
	const chestBaseRef = useRef(null)
	const [scene, setScene] = useState(null)
	const controlsRef = useRef(null)
	const lidMinX = -1
	const lidMaxX = 0.95

	let dragInitialX = lidMaxX

	useEffect(() => {
		loader.load("/src/assets/3D-Models/Chest_Separated.glb", gltf => {
			const chestGroup = gltf.scene.children[0]

			const lidMesh = chestGroup.children.find(
				child => child.name === "Chest_Lid"
			)
			const baseMesh = chestGroup.children.find(
				child => child.name === "Chest_Base"
			)

			chestLidRef.current = lidMesh
			chestBaseRef.current = baseMesh

			setScene(gltf.scene)
		})
	}, [])

	function checkLidRotation() {
		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation

			let finalX = 0
			if (dragInitialX > -1) {
				// Lid starts from closed
				finalX = lid.x > 0.55 ? lidMaxX : lidMinX
			} else {
				// Lid starts from open
				finalX = lid.x > -0.55 ? lidMaxX : lidMinX
			}

			gsap.to(lid, {
				x: finalX,
				duration: 0.25,
				ease: "power2.out",
			})
		}
	}

	function handleDragStart() {
		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation
			dragInitialX = lid.x
		}
	}

	function handleDragEnd(event) {
		controlsRef.current.enableRotate = true
		checkLidRotation()
	}

	function handleDrag(state) {
		controlsRef.current.enableRotate = false

		if (chestLidRef.current) {
			const lid = chestLidRef.current.rotation
			const chestAngle = controlsRef.current.getAzimuthalAngle()

			const lookingFromFront = chestAngle > -0.35 && chestAngle < 0.35
			const lookingFromRight = chestAngle > 0

			let rotation = state.delta[0] * 0.01
			if (lookingFromFront) {
				rotation = state.delta[1] * 0.01
			} else if (lookingFromRight) {
				rotation = -rotation
			}

			const intermediateValue = Math.max(lid.x + rotation, lidMinX)
			const newRotationX = Math.min(intermediateValue, lidMaxX)
			lid.x = newRotationX
		}
	}

	const bind = useGesture({
		onDrag: handleDrag,
		onDragStart: handleDragStart,
		onDragEnd: handleDragEnd,
	})

	function getRandomPositionInChestBase() {
		const minX = -0.5
		const maxX = 0.5
		const minY = -0.4
		// const maxY = 3
		const maxY = -0.3
		const minZ = 0.4
		const maxZ = 1.3

		return [
			Math.random() * (maxX - minX) + minX,
			Math.random() * (maxY - minY) + minY,
			Math.random() * (maxZ - minZ) + minZ,
		]
	}

	function PlaneCollider({ args, position, isRotatedY, isRotatedX }) {
		return (
			<Plane
				args={args ?? [0.062, 0.04]}
				rotation-x={isRotatedX ? -Math.PI / 2 : 0}
				rotation-y={isRotatedY ? -Math.PI / 2 : 0}
				// material-color="hidden"
				material-opacity={0}
				material-transparent={true}
				material-side={THREE.DoubleSide}
				position={position}
			/>
		)
	}

	function ChestCollider(props) {
		return (
			<RigidBody
				colliders="hull"
				type="fixed"
				scale={20}
				position={[0, -0.75, 0.91]}
			>
				<PlaneCollider
					isRotatedX
					args={[0.075, 0.075]}
					position={[0, 0.017, 0]}
				></PlaneCollider>
				<PlaneCollider position={[0, 0.02, 0.031]}></PlaneCollider>
				<PlaneCollider position={[0, 0.02, -0.031]}></PlaneCollider>
				<PlaneCollider
					position={[-0.031, 0.02, 0]}
					isRotatedY
				></PlaneCollider>
				<PlaneCollider
					position={[0.031, 0.02, 0]}
					isRotatedY
				></PlaneCollider>
			</RigidBody>
		)
	}

	return (
		<>
			{scene && (
				<>
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<Note position={getRandomPositionInChestBase()} />
					<RigidBody colliders={"hull"} type="fixed">
						<ChestCollider />
					</RigidBody>
					<primitive object={chestBaseRef.current} />

					<primitive {...bind()} object={chestLidRef.current} />
					<OrbitControls ref={controlsRef} enableZoom={true} />
				</>
			)}
		</>
	)
}

export default TreasureChest
