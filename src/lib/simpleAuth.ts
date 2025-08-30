"use server"

import {cookies} from "next/headers";

const AUTH_COOKIE_NAME = "onyx-auth-token";

export async function getIsAuthenticated() {
	const cookieStore = await cookies();
	
	const token = cookieStore.get(AUTH_COOKIE_NAME);
	
	if (!token) {
		return undefined;
	}
	
	return verifyToken(token.value);
}

function verifyToken(token: string) {
	const validToken = process.env.SIMPLE_AUTH_SECRET;
	
	return token === validToken
}

export async function login(password: string) {
	const valid = verifyToken(password);
	
	console.log("Valid:", password, valid);
	
	if (!valid) {
		return false;
	}
	
	const cookieStore = await cookies();
	cookieStore.set(AUTH_COOKIE_NAME, password);
	
	return true;
}