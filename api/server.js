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

// async function loginUser(email, password) {
// 	try {
// 		const user = await usersCollection.findOne({ email })
// 		if (!user) {
// 			throw new Error("User not found")
// 		}

// 		// const isPasswordValid = await bcrypt.compare(password, user.password)
// 		// if (!isPasswordValid) {
// 		// 	throw new Error("Invalid password")
// 		// }

// 		// You can include additional data or tokens in the response
// 		return {
// 			message: "Login successful",
// 			user: { _id: user._id, email: user.email },
// 		}
// 	} catch (err) {
// 		throw err
// 	}
// }

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

		// Generate a JWT token for the authenticated user
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{
				expiresIn: "1h",
			}
		)

		return { message: "Login successful", token }
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
		const { message, token } = await loginUser(email, password)
		res.json({ message, token })
	} catch (err) {
		console.error("Error logging in:", err.message)
		res.status(401).json({ error: "Invalid credentials" })
	}
})

// Example route to get all boxes of each type for the logged-in user
app.get("/user/boxes", async (req, res) => {
	const authToken = req.body.authorization

	console.log(authToken)

	if (!authToken || !authToken.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: "Unauthorized - Missing or invalid token" })
	}

	const token = authToken.split(" ")[1] // Extracting the JWT token from the Authorization header
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
		const userId = decodedToken.userId

		// Check if the user ID from the token matches the logged-in user's ID
		if (userId !== req.body.user._id) {
			return res
				.status(401)
				.json({ error: "Unauthorized - Token does not match user ID" })
		}

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
