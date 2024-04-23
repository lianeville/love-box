import { useEffect, useState } from "react"
import { fetchWithToken, getCookies } from "../requests"
const dbHost = import.meta.env.VITE_DB_HOST

function BoxList() {
	const [boxes, setBoxes] = useState(null)

	useEffect(() => {
		const { accessToken, refreshToken } = getCookies([
			"accessToken",
			"refreshToken",
		])
		getBoxes(accessToken, refreshToken)
	}, [])

	useEffect(() => {
		console.log("boxes", boxes)
	}, [boxes])

	async function getBoxes(accessToken, refreshToken) {
		const url = dbHost + "/user/boxes"
		try {
			const boxes = await fetchWithToken(url, accessToken, refreshToken)
			setBoxes(boxes)
		} catch (error) {
			console.error("Error getting boxes:", error)
		}
	}

	return (
		<div className="w-full fixed bottom-0 p-6 select-none">
			<div className="h-24 w-full bg-header py-3 px-6 rounded-md">
				<img
					className="h-full"
					src="/src/assets/icons/treasure-chest.webp"
					alt=""
				/>
			</div>
		</div>
	)
}

export default BoxList
