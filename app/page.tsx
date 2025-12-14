import FooterComponent from "@/components/layout/footer.component";
import NavComponent from "@/components/nav.component";
import { getAllMeteorite } from "@/lib/action/meteorite.action";
import { Meteorite } from "@/lib/interfaces/meteorite-interface";


export default async function Home() {
	const meteoriteData: Meteorite[] = await getAllMeteorite();

	return (
		<>
			<NavComponent data={ meteoriteData }/>
			<FooterComponent />
		</>
	);
}
