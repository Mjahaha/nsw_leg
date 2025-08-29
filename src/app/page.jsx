import Header from '../components/Header';
import Body from '../components/Body';
import {getIsAuthenticated} from "../lib/simpleAuth";
import {redirect} from "next/navigation";


export default async function Home() {
	const isAuthenticated = await getIsAuthenticated();
	
	if (!isAuthenticated) {
		redirect("/login");
	}
	return (
		<main>
			<header>
				<Header/>
			</header>
			<Body/>
		</main>
	);
}
