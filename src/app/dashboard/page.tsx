import styles from './styles.module.css'
import Head from 'next/head'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import { Textarea } from '@/components/textarea';
import {FiShare2} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu Painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
            <div className={styles.contentForm}>
                <h1 className={styles.title}>Qual sua tarefa ?</h1>
                <form action="">
                    <Textarea placeholder='Digite sua tarefa...'/>
                    <div className={styles.checkboxArea}>
                        <input type="checkbox" className={styles.checkbox}/>
                        <label htmlFor="">Deixar tarefa pública ?</label>
                    </div>
                    <button className={styles.button} type='submit'>Registrar</button>
                </form>
            </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>
          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PUBLICO</label>
              <button className={styles.shareButton}>
                <FiShare2 color='#3183ff' size={22}/>
              </button>
            </div>
            <div className={styles.taskContent}>
              <p>Miha primeira tarefa exemplo</p>
              <button className={styles.trashButton}>
                <FaTrash size={24} color='#ea3140'/>
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
