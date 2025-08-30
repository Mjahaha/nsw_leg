export default function Dump({ data }: { data: TODO }) {
	return <pre className={"bg-white rounded-e-lg p-3 text-left text-sm max-w-7xl mx-auto overflow-auto text-black"}>{JSON.stringify(data ?? {}, null, 2)}</pre>;
}