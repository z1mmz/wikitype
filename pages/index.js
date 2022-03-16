import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import TypeSpace from'../components/typeSpace'
import { useState } from 'react'; 




export default function Home() {

  const [wikitext, setWikitext] = useState("wikitext")

  

  return (
    <Layout>
    <div className={styles.container}>
      <Head>
        <title>WIKITYPE</title>
        <meta name="description" content="Wikipedia typing game, learn while you learn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
           <TypeSpace/>
        </div>

      </main>

    </div>
    </Layout>
  )
}
