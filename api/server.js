const express = require("express")
const dotenv = require("dotenv")
const { MongoClient, ObjectId } = require("mongodb")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

dotenv.config()

const port = process.env.PORT || 3000
const mongoURI = process.env.mongoURI
const dbName = process.env.dbName
const JWT_SECRET = process.env.JWT_SECRET
const app = express()

const client = new MongoClient(mongoURI)
const db = client.db(dbName)
const boxCollection = db.collection("Boxes")
const noteCollection = db.collection("Notes")
const usersCollection = db.collection("Users")

app.use(express.json())
app.use(cors())

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

async function getNotes(noteIds) {
	try {
		const objectIds = noteIds.map(id => new ObjectId(id))
		const notes = await noteCollection
			.find({ _id: { $in: objectIds } })
			.toArray()
		return notes
	} catch (err) {
		console.error("Error getting notes:", err)
		throw err
	}
}

// app.get("/boxes", async (req, res) => {

// })

function generateAccessToken(user) {
	return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" })
}

function generateRefreshToken(user) {
	return jwt.sign(user, JWT_SECRET, { expiresIn: "30d" })
}

async function loginUser(email, password) {
	try {
		// Check if the user with the provided email exists in the database
		const user = await usersCollection.findOne({ email })
		if (!user) {
			throw new Error("User not found")
		}

		// Compare the provided password with the hashed password stored in the database
		// const isPasswordValid = await bcrypt.compare(password, user.password)
		// if (!isPasswordValid) {
		// 	throw new Error("Invalid password")
		// }

		const userData = { user_id: user._id, email: user.email }

		const accessToken = generateAccessToken(userData)
		const refreshToken = generateRefreshToken(userData)

		// Generate a JWT token for the authenticated user
		const tokens = { access: accessToken, refresh: refreshToken }

		console.log(tokens)

		return { message: "Login successful", tokens: JSON.stringify(tokens) }
	} catch (err) {
		throw err
	}
}

async function getBoxesByType(userId) {
	try {
		// Find the user based on their ID
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
		if (!user) {
			throw new Error("User not found")
		}

		// Get all created boxes for the user
		const createdBoxes = await boxCollection
			.find({ _id: { $in: user.created_box_ids } })
			.toArray()

		// Get all received boxes for the user
		const receivedBoxes = await boxCollection
			.find({ _id: { $in: user.received_box_ids } })
			.toArray()

		return { createdBoxes, receivedBoxes }
	} catch (err) {
		throw err
	}
}

app.post("/login", async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" })
	}

	try {
		const { message, tokens } = await loginUser(email, password)
		res.json({ message, tokens })
	} catch (err) {
		console.error("Error logging in:", err.message)
		res.status(401).json({ error: "Invalid credentials" })
	}
})

app.get("/refresh-token", async (req, res) => {
	let refreshToken = req.headers.refresh

	if (!refreshToken) {
		return res.status(401).json({ error: "Unauthorized - Missing tokens" })
	}

	try {
		const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET)
		const userId = decodedToken.user_id
		const userEmail = decodedToken.email

		const userData = { user_id: userId, email: userEmail }

		const accessToken = generateAccessToken(userData)
		refreshToken = generateRefreshToken(userData)

		const tokens = { access: accessToken, refresh: refreshToken }

		res.json(JSON.stringify(tokens))
		return { message: "Login successful", tokens: JSON.stringify(tokens) }
	} catch (err) {
		console.error("Invalid Refresh Token:", err)
		res.status(401).json({ error: "Unauthorized - Invalid token" })
	}
})

// Example route to get all boxes of each type for the logged-in user
app.get("/user/boxes", async (req, res) => {
	const accessToken = req.headers.access

	if (!accessToken) {
		return res.status(401).json({ error: "Unauthorized - Missing token" })
	}

	try {
		const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET)
		const userId = decodedToken.user_id

		console.log("tokenData", decodedToken)

		const { createdBoxes, receivedBoxes } = await getBoxesByType(userId)
		res.json({ createdBoxes, receivedBoxes })
	} catch (err) {
		console.error("Error getting boxes:", err)
		res.status(401).json({ error: "Unauthorized - Invalid token" })
	}
})

app.get("/box/:boxId", async (req, res) => {
	try {
		const boxId = new ObjectId(req.params.boxId)
		const box = await boxCollection.findOne(boxId)
		const boxNotes = await getNotes(box.note_ids)

		box.creator_notes = boxNotes.filter(note =>
			note.sender_id.equals(box.creator_id)
		)
		box.receiver_notes = boxNotes.filter(note =>
			note.sender_id.equals(box.receiver_id)
		)

		if (!box) {
			return res.status(404).json({ error: "Box not found" })
		}

		res.json(box)
	} catch (err) {
		console.error("Error getting box:", err)
		res.status(500).json({ error: "Internal server error" })
	}
})
