import React, {PropsWithChildren, useState} from "react";
import {LegislationContext, LegislationItem} from "@/components/LegislationContext/LegislationContext.hooks";

export function LegislationContextProvider({ children }: PropsWithChildren) {
	const [legislationList, setLegislationList] = useState<LegislationItem[]>([]);
	
	return <LegislationContext.Provider value={{}}>{children}</LegislationContext.Provider>;
}

