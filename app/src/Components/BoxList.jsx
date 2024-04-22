import { useEffect, useState } from "react"
const dbHost = import.meta.env.VITE_DB_HOST

function BoxList() {
	const [boxes, setBoxes] = useState(null)

	useEffect(() => {
		const { accessToken, refreshToken } = getCookies([
			"accessToken",
			"refreshToken",
		])
		setBoxes(getBoxes(accessToken, refreshToken))
	}, [])

	useEffect(() => {
		console.log("boxes")
		console.log(boxes)
	}, [boxes])

	function getCookies(cookieNames) {
		const cookies = {}
		const cookieString = document.cookie

		cookieNames.forEach(name => {
			const value = `; ${cookieString}`
			const parts = value.split(`; ${name}=`)
			if (parts.length === 2) cookies[name] = parts.pop().split(";").shift()
		})

		return cookies
	}

	async function getBoxes(accessToken, refreshToken) {
		try {
			const response = await fetch(dbHost + "/user/boxes", {
				method: "GET",
				headers: {
					access: accessToken,
				},
			})

			if (!response.ok) {
				if (response.status === 401) {
					// Access token expired, attempt to refresh
					const refreshedTokens = await refreshTokenRequest(refreshToken)
					if (refreshedTokens) {
						// Retry the original request with the new access token
						return getBoxes(
							refreshedTokens.access,
							refreshedTokens.refresh
						)
					} else {
						throw new Error("Failed to refresh tokens")
					}
				} else {
					throw new Error("Network response was not ok")
				}
			}

			return setBoxes(await response.json())
		} catch (error) {
			console.error("Error getting boxes:", error)
		}
	}

	async function refreshTokenRequest(refreshToken) {
		try {
			const response = await fetch(dbHost + "/refresh-token", {
				method: "GET",
				headers: {
					refresh: refreshToken,
				},
			})

			if (!response.ok) {
				throw new Error("Failed to refresh tokens")
			}

			let tokens = await response.json()
			tokens = JSON.parse(tokens)

			// Save the refreshed tokens as cookies
			document.cookie = `accessToken=${tokens.access}; HttpOnly; Secure; SameSite=Strict;`
			document.cookie = `refreshToken=${tokens.refresh}; HttpOnly; Secure; SameSite=Strict;`

			return tokens
		} catch (error) {
			console.error("Error refreshing tokens:", error)
			return null
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
