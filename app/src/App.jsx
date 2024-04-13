import "./App.css"
import ModelViewer from "./ModelViews"
import { create } from "zustand"
const dbHost = import.meta.env.VITE_DB_HOST

const useBoxStore = create(set => ({
	activeBox: 2,
	inc: () => set(state => ({ activeBox: 5 })),
}))

function ChestHi() {
	const { activeBox, loadBox } = useBoxStore()

	return (
		<button className="h-6 w-6 bg-gray-200 text-black" onClick={loadBox}>
			{activeBox}
		</button>
	)
}

function App() {
	return (
		<div className="h-full flex">
			<ChestHi></ChestHi>
			<ModelViewer />
		</div>
	)
}

export default App
