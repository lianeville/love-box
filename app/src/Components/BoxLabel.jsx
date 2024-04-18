function BoxLabel({ name }) {
	return (
		<div className="flex z-50 h-0 static w-full justify-center">
			<div className="p-2">
				<div className="bg-label p-2 rounded-md">
					<span className="text-3xl">{name}</span>
				</div>
			</div>
		</div>
	)
}

export default BoxLabel
