"use client";
import { useState } from "react";
import ChartsComponent from "@/components/charts.component";
import HomeComponent from "@/components/home.component";
import Map2D from "@/components/map2D.component";
import Kpi from "@/components/kpi.component";

import { columns } from "@/components/data-table-all-component/data-table-columns.component";
import { DataTable } from "@/components/data-table-all-component/data-table.component";
import { Meteorite } from "@/lib/interfaces/meteorite-interface";


export default function NavComponent({ data }: { data: Meteorite[] }) {
	const [selectedMenu, setSelectedMenu] = useState("home");
	const menuItems = [
		{ key: "home", label: "Accueil" },
		{ key: "carte", label: "Carte" },
		{ key: "tableau", label: "Tableau" },
		{ key: "graphique", label: "Graphique" },
		{ key: "data", label: "KPI" },
	];

	const renderContent = () => {
		switch (selectedMenu) {
			case "home" :
				return <HomeComponent  />;
			case "carte":
				return <Map2D meteorites={data} />;
			case "tableau":
				return <DataTable<Meteorite, unknown> columns={columns} data={data} />;
			case "graphique":
				return <ChartsComponent meteorites={data} />;
			case "data":
				return <Kpi meteorites={data}/>
			default:
				return <div>Sélectionnez un menu pour voir le contenu.</div>;
		}
	};

	return (
		<>
			<header>
				<nav>
					{menuItems.map((item) => (
						<button key={item.key}
								onClick={() => setSelectedMenu(item.key)}
								className={`nav-button ${
									selectedMenu === item.key ? "active" : ""
								}`}>
							{item.label}
						</button>
					))}
				</nav>
			</header>
			<main>{renderContent()}</main>
		</>
	);
}
