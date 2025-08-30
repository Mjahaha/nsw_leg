import {getIsAuthenticated} from "@/lib/simpleAuth";
import {redirect} from "next/navigation";
import LoginForm from "@/components/LoginForm";


export default async function Login() {
	const isAuthenticated = await getIsAuthenticated();
	
	if (isAuthenticated) {
		return redirect("/");
	}
	
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-3xl font-bold">Login</h1>
			<LoginForm/>
		</div>
	);
}