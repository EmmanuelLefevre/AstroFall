export interface Meteorite {
	_id?: string;
	"(A)chondrite": string | null;     		// Achondrite ou Chondrite
	id: number;
	Class: string | null;
	Country: string;
	latitude: number;
	longitude: number;
	ff: "Find" | "Fall";
	Group: string | null;
	Locality: string;
	mck: string; 													// Code météorite
	Month: string | null;
	Name: string;
	"Petrologic type": string | null;
	"Recovered weight": string | null;
	"Shock stage": string | null;        	// Stade de choc
	Synonyms: string | null;
	Type: MeteoriteType | null;
	wg: string | null; 										// Autres informations
	Year: string;
}

export type MeteoriteType = "Stone" | "Iron" | "Stony-Iron";
