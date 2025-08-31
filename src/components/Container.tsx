import React, {ComponentProps, PropsWithChildren} from "react";
import {cn} from "@/lib/utils";

export default function Container({ children, className }: PropsWithChildren<ComponentProps<"div">>) {
	return (
		<div className={cn("container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
			{children}
		</div>
	);
}