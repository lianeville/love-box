import "./App.css"
import ModelViewer from "./ModelViews"
import { create } from "zustand"
const dbHost = import.meta.env.VITE_DB_HOST

const useBoxStore = create(set => ({
	activeBox: null,
	inc: () => set(state => ({ activeBox: 5 })),
}))

function ChestHi() {
	const { activeBox, loadBox } = useBoxStore()

	return <button onClick={loadBox}>{activeBox}</button>
}

function App() {
	return (
		<div>
			<ChestHi></ChestHi>
			<ModelViewer />
		</div>
	)
}

export default App
