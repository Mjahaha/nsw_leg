

export default function SwitchInput({checked, onChange}: {checked: boolean, onChange: (checked: boolean) => void}) {
	return (
		<div className="flex items-center">
			<button
				className={`${checked ? 'bg-green-600 text-gray-100' : 'bg-gray-100 text-gray-900'} rounded-l-xl p-2 w-8 h-8 flex items-center justify-center cursor-pointer`}
				onClick={() => onChange(!checked)}
				disabled={checked}
			>
				<CheckSvg/>
			</button>
			<button
				className={`${!checked ? 'bg-red-500 text-gray-100' : 'bg-gray-100 text-gray-900'} rounded-r-xl p-2 w-8 h-8 flex items-center justify-center cursor-pointer`}
				onClick={() => onChange(!checked)}
				disabled={!checked}
			>
				<CloseSvg />
			</button>
		</div>
	);
}

const CheckSvg = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	)
}

const CloseSvg = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clipRule="evenodd"
			/>
		</svg>
	)
}