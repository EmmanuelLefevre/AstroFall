import React from 'react'
import Image from "next/image";
import Link from 'next/link'

export default function FooterComponent() {
	return (
		<footer>
			<div id="footer-header">
				<span id="copyright">Copyright © 2025</span>
				<span className="from">Made with</span>
				<span id="heart">❤</span>
				<span className="from">in Bordeaux</span>
			</div>
			<div id="authors">
				<Image
					src="/images/linkedin.png"
					alt="Logo de LinkedIn"
					width={22}
					height={22}/>
				<Link
					href="https://www.linkedin.com/in/adrien-lazaille-11767266/"
					target="_blank"
					aria-label="Lien vers le profil Linkedin de Adrien Lazaille"
					className="linkedin-links"
					rel="noopener noreferrer">
						Adrien Lazaille
				</Link>
				<span>|</span>
				<Link
					href="https://www.linkedin.com/in/emmanuel-l-06350b167/"
					target="_blank"
					aria-label="Lien vers le profil Linkedin de Emmanuel lefevre"
					className="linkedin-links"
					rel="noopener noreferrer">Emmanuel Lefevre
				</Link>
				<span>|</span>
				<Link
					href="https://www.linkedin.com/in/corentin-beyries/"
					target="_blank"
					aria-label="Lien vers le profil Linkedin de Corentin Beyries"
					className="linkedin-links"
					rel="noopener noreferrer">Corentin Beyries
				</Link>
				<span>|</span>
				<Link
					href="https://www.linkedin.com/in/camille-hoareau-487782253/"
					target="_blank"
					aria-label="Lien vers le profil Linkedin de Camille Hoareau"
					className="linkedin-links"
					rel="noopener noreferrer">Camille Hoareau
				</Link>
			</div>
		</footer>
	)
}
