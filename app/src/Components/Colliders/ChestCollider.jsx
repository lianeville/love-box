import { Plane } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"

function PlaneCol({ args, position, isRotatedY, isRotatedX }) {
	const rotationX = isRotatedX ? -Math.PI / 2 : 0
	const rotationY = isRotatedY ? -Math.PI / 2 : 0
	args = args ?? [0.062, 0.04]

	return (
		<Plane
			args={args}
			rotation-x={rotationX}
			rotation-y={rotationY}
			material-opacity={0}
			material-transparent={true}
			material-side={THREE.DoubleSide}
			position={position}
		/>
	)
}

function ChestCollider() {
	const colliderProps = {
		colliders: "hull",
		type: "fixed",
		scale: 20,
		position: [0, -0.75, 0.91],
	}

	return (
		<RigidBody {...colliderProps}>
			<PlaneCol isRotatedX args={[0.075, 0.075]} position={[0, 0.017, 0]} />
			<PlaneCol position={[0, 0.02, 0.031]}></PlaneCol>
			<PlaneCol position={[0, 0.02, -0.031]}></PlaneCol>
			<PlaneCol position={[-0.031, 0.02, 0]} isRotatedY></PlaneCol>
			<PlaneCol position={[0.031, 0.02, 0]} isRotatedY></PlaneCol>
		</RigidBody>
	)
}

export default ChestCollider
