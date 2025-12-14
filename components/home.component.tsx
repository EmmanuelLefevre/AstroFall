import React from "react";
import Image from "next/image";

import styles from "@/public/styles/modules/animations.module.scss";


export default function HomeComponent() {
	return (
		<div id="home">
			<Image
				id="logo"
				src="/images/astroFallLogo.webp"
				alt="Logo de l'application AstroFalls"
				className={ styles.grow }
				width={500}
				height={500}
				priority />
		</div>
	);
}
