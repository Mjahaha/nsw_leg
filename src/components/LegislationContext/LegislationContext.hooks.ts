import {createContext, useContext} from "react";

export const LegislationContext = createContext<TODO>({});

export function useLegislationContext() {
	const context = useContext<LegislationContextType>(LegislationContext);
	if (context === undefined) {
		throw new Error("useLegislationContext must be used within a LegislationContextProvider");
	}
	return context;
}

export type LegislationContextType = {
	legislationList: LegislationItem[];
	stageTwoCommenced: boolean;
	addStageTwoResponseForLegislation: (id: string, response: string) => void;
	toggleApplies: (id: string) => void;
};

export type LegislationItem = {
	id: string;
	name: string;
	applies: boolean;
	comment: string;
}