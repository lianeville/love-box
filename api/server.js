const express = require("express")
const dotenv = require("dotenv")
const { MongoClient, ObjectId } = require("mongodb")
const cors = require("cors")

dotenv.config()

const port = process.env.PORT || 3000
const mongoURI = process.env.mongoURI
const dbName = process.env.dbName
const app = express()

const client = new MongoClient(mongoURI)
const db = client.db(dbName)
const boxCollection = db.collection("Boxes")
const noteCollection = db.collection("Notes")

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
