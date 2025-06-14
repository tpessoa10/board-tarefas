'use client'


import Head from "next/head";
import styles from './style.module.css'
import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { useRouter } from 'next/navigation'
import { Textarea } from "@/components/textarea";
import { useSession } from "next-auth/react";
import { FaTrash } from 'react-icons/fa'



interface Task {
    create: string
    public: boolean
    tarefa: string
    user: string
    id: string

}

export default function Task() {
    const { data: session } = useSession()
    const [input, setInput] = useState("")
    const [task, setTask] = useState<Task>()
    const [comments, setComments] = useState<any[]>([])
    const params = useParams()
    const router = useRouter()
    const id = params!.id as string;


    async function getTaskById(id: string) {
        const docRef = doc(db, "tarefas", id);
        const snap = await getDoc(docRef);

        if (snap.data() === undefined) {
            router.push("/")
        }

        if (snap.data()?.public === false) {
            router.push("/")
        }

        if (!snap.exists()) {
        }

        console.log('snao', snap.data())
        const miliseconds = snap.data()?.create.seconds * 1000
        const task: Task = {
            create: new Date(miliseconds).toLocaleDateString(),
            public: snap.data()?.public,
            tarefa: snap.data()?.tarefa,
            user: snap.data()?.user,
            id: id
        }
        setTask(task)
    }

    async function handleComment(event: FormEvent) {
        event.preventDefault()

        if (input === "") return

        if (!session?.user?.email || !session?.user?.name) return

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                create: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: id
            })

            const newComment = {
                id: docRef.id,
                 comment: input,
                create: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: id
            }
            setComments((prevComments) => [...prevComments, newComment])
            setInput("")
        } catch (e) {
            console.log(e)
        }

        console.log('foi')
    }

    async function getComments() {
        const q = query(
            collection(db, "comments"),
            where("taskId", "==", id),
            orderBy("create", "desc")
        )

        const snapshot = await getDocs(q)
        const list: any[] = []

        snapshot.forEach(doc => {
            list.push({
                id: doc.id,
                ...doc.data()
            })
        })

        setComments(list)
    }

    console.log('comments ', comments)

    useEffect(() => {
        getTaskById(id)
        getComments()
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
                <form onSubmit={handleComment}>
                    <Textarea value={input} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} />
                    <button disabled={!session?.user} className={styles.button}>Enviar Comentário</button>
                </form>
            </section>
            <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>
                {comments.length === 0 && (
                    <span>Nenhum comentário foi encontrado</span>
                )}
                {comments.map((item) => (
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>
                            {item.user === session?.user?.email ?
                                (
                                    <button className={styles.buttonTrash}>
                                        <FaTrash size={18} color="#EA3140" />
                                    </button>
                                ) : ''}
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}
