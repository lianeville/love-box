const express = require("express")
const dotenv = require("dotenv")
const { MongoClient, ObjectId } = require("mongodb")

dotenv.config()

const port = process.env.PORT || 3000
const mongoURI = process.env.mongoURI
const dbName = process.env.dbName
const app = express()

const client = new MongoClient(mongoURI)
const db = client.db(dbName)
const boxCollection = db.collection("Boxes")

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

app.get("/box/:boxId", async (req, res) => {
	try {
		const boxId = new ObjectId(req.params.boxId) // Extract boxId from URL
		const box = await boxCollection.findOne(boxId) // Find box by ObjectId

		if (!box) {
			return res.status(404).json({ error: "Box not found" })
		}

		res.json(box)
	} catch (err) {
		console.error("Error getting box:", err)
		res.status(500).json({ error: "Internal server error" })
	}
})
