import { useEffect, useState } from "react"
const dbHost = import.meta.env.VITE_DB_HOST

function BoxList() {
	const [boxes, setBoxes] = useState(null)

	useEffect(() => {
		let token = document.cookie
		if (token.length < 2) return

		token = token.split("=")[1]

		setBoxes(getBoxes(token))
	}, [])

	useEffect(() => {
		console.log(boxes)
	}, [boxes])

	async function getBoxes(token) {
		try {
			const response = await fetch(dbHost + "/user/boxes", {
				method: "GET",
				headers: {
					authorization: "Bearer " + token,
				},
			})

			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			return setBoxes(await response.json())
		} catch (error) {
			console.error("Error getting boxes:", error)
		}
	}

	return (
		<div className="w-full fixed bottom-0 p-6">
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
