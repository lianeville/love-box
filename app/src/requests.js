const dbHost = import.meta.env.VITE_DB_HOST

export function getCookies(cookieNames) {
	const cookies = {}
	const cookieString = document.cookie

	cookieNames.forEach(name => {
		const value = `; ${cookieString}`
		const parts = value.split(`; ${name}=`)
		if (parts.length === 2) cookies[name] = parts.pop().split(";").shift()
	})

	return cookies
}

export async function fetchWithToken(url, accessToken, refreshToken) {
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				access: accessToken,
			},
		})

		if (response.status === 401) {
			const refreshedTokens = await refreshTokenRequest(refreshToken)
			if (refreshedTokens) {
				return fetchWithToken(
					url,
					refreshedTokens.access,
					refreshedTokens.refresh
				)
			} else {
				throw new Error("Failed to refresh tokens")
			}
		}

		return response.json()
	} catch (error) {
		console.error("Fetch with token error:", error)
		throw error
	}
}

async function refreshTokenRequest(refreshToken) {
	console.log("Refreshing Tokens")
	try {
		const response = await fetch(dbHost + "/refresh-token", {
			method: "GET",
			headers: {
				refresh: refreshToken,
			},
		})

		if (!response.ok) return false

		let tokens = await response.json()
		tokens = JSON.parse(tokens)
		document.cookie = `accessToken=${tokens.access}; path=/`
		document.cookie = `refreshToken=${tokens.refresh}; path=/`

		return tokens
	} catch (error) {
		console.error("Error refreshing tokens:", error)
		return null
	}
}
