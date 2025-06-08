'use client'


import Head from "next/head";
import styles from './style.module.css'
import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import {useRouter} from 'next/navigation'
import { Textarea } from "@/components/textarea";



interface Task{
    create:string
    public:boolean
    tarefa:string
    user:string
    id:string

}

export default function Task() {
    const [task, setTask] = useState<Task>()
    const params = useParams()
    const router = useRouter()
    const id = params!.id as string;


    async function getTaskById(id: string) {
        const docRef = doc(db, "tarefas", id);
        const snap = await getDoc(docRef);

        if(snap.data() === undefined){
            router.push("/")
        }

        if(snap.data()?.public === false){
            router.push("/")
        }

        if (!snap.exists()) {
        }

        console.log('snao', snap.data())
        const miliseconds = snap.data()?.create.seconds * 1000
        const task:Task = {
            create: new Date(miliseconds).toLocaleDateString(),
            public: snap.data()?.public,
            tarefa: snap.data()?.tarefa,
            user: snap.data()?.user,
            id: id
        }
        setTask(task)
    }

    useEffect(() => {
        getTaskById(id)
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>{task?.tarefa}</p>
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar Comentário</h2>
                <form action="">
                    <Textarea/>
                    <button className={styles.button}>Enviar Comentário</button>
                </form>
            </section>
        </div>
    )
}
