import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
const dbHost = import.meta.env.VITE_DB_HOST

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()

	const handleLogin = async e => {
		e.preventDefault()
		const data = { email, password }

		try {
			const response = await fetch(dbHost + "/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const { message, tokens } = await response.json()

			console.log(message)
			const accessToken = JSON.parse(tokens).access
			const accessRefresh = JSON.parse(tokens).refresh

			// Store token in cookie
			document.cookie = `accessToken=${accessToken}; path=/`
			document.cookie = `refreshToken=${accessRefresh}; path=/`

			// console.log("Login successful:", message)

			// Navigate to home page or any other route
			// navigate("/")
		} catch (error) {
			console.error("Error logging in:", error)
		}
	}

	return (
		<div className="flex flex-col h-full justify-center items-center">
			<form onSubmit={handleLogin} className="flex flex-col gap-2">
				<input
					type="text"
					placeholder="Email"
					value={email}
					className="p-2 rounded-lg"
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					className="p-2 rounded-lg"
					onChange={e => setPassword(e.target.value)}
				/>
				<div className="flex w-full justify-end px-4">
					<button
						className="bg-header p-1 rounded-lg w-full"
						type="submit"
					>
						Login
					</button>
				</div>
			</form>
		</div>
	)
}

export default Login
