import React, { useState } from "react"

const Login = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleLogin = e => {
		e.preventDefault()
		console.log("Logging in...", username, password)
		// Example: Call an API to authenticate the user
	}

	return (
		<div className="flex flex-col h-full justify-center items-center">
			<form onSubmit={handleLogin} className="flex flex-col gap-2">
				<input
					type="text"
					placeholder="Username"
					value={username}
					className="p-2 rounded-lg"
					onChange={e => setUsername(e.target.value)}
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
