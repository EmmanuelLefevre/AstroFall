import Image from "next/image";
import styles from "@/public/styles/modules/background.module.scss";


export default function Background() {
  return (
    <div className={ styles.background }>
      <Image
        src="/images/bg.jpg"
        alt="Background"
        fill
        priority
        quality={80}
        className={ styles.image }
      />
    </div>
  );
}
