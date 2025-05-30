import Image from "next/image";
import styles from "./page.module.css";
import HeroImg from '../../public/assets/hero.png'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Meu Projeto</h1>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero} alt="Logo Tarefas+" src={HeroImg} priority />
        </div>
        <h1 className={styles.title}>
          Sistema feitos para você organizar <br />
          Seus estudos e tarefas
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>
              +12 posts
            </span>
          </section>
          <section className={styles.box}>
            <span>
              +90 comentários
            </span>
          </section>
        </div>
      </main>
    </div>
  );
}
