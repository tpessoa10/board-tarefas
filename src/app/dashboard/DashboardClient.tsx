'use client';

import { Textarea } from '@/components/textarea';
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import { ChangeEvent, FormEvent, useState } from 'react';
import { db } from '@/services/firebaseConnection';
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useEffect } from 'react';

import styles from './styles.module.css'
import Head from 'next/head'
import Link from 'next/link';

interface TasksProps {
  id: string,
  create: Date,
  public: boolean,
  tarefa: string,
  user: string
}


export default function DashboardClient({ session }: { session: any }) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([])

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleShare(id:string){
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`)
  }

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas")
      const q = query(
        tarefasRef,
        orderBy("create", 'desc'),
        where("user", "==", session.user?.email)
      )

      onSnapshot(q, (snapShot) => {
        let lista = [] as TasksProps[]
        snapShot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            create: doc.data().create,
            user: doc.data().user,
            public: doc.data().public
          })
        })
        setTasks(lista)
      })
    }



    loadTarefas()

  }, [session.user?.email])

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        create: new Date(),
        user: session?.user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteTask(id:string) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu Painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                value={input}
                placeholder='Digite sua tarefa...'
              />
              <div className={styles.checkboxArea}>
                <input
                  checked={publicTask}
                  onChange={handleChangePublic}
                  type="checkbox"
                  className={styles.checkbox}
                />
                <label>Deixar tarefa pública?</label>
              </div>
              <button className={styles.button} type="submit">Registrar</button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>
          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PÚBLICO</label>
                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 color="#3183ff" size={22} />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.tarefa}</p>
                  </Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}
                <button  onClick={() => handleDeleteTask(item.id)} className={styles.trashButton}>
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
