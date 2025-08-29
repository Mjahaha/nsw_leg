"use client";

import {FormEvent, useRef} from "react";
import {login} from "@/lib/simpleAuth";
import {redirect} from "next/navigation";

export default function LoginForm() {
	const passwordRef = useRef<HTMLInputElement>(null);
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	
		const password = passwordRef.current?.value;
		if (!password) {
			return;
		}
		
		const success = await login(password);
		
		if (!success) {
			alert("Invalid password");
			if (passwordRef.current)
				passwordRef.current.value = "";
			return;
		}
		
		redirect("/");
	};
	
  return (
      <form className="flex flex-col items-center justify-center w-full max-w-md" onSubmit={handleSubmit}>
        <input ref={passwordRef} type="password" placeholder="Password" className="mt-4 p-2 rounded-md border border-gray-300" />
        <button className="mt-4 p-2 px-5 rounded-md bg-gray-900 text-gray-100 hover:opacity-80 transition">Login</button>
      </form>
  );
}