import Image from "next/image";
import styles from "./page.module.css";
export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <p>
          Welcome! <br />
          Read more how to use this on the repository Github Readme: <br />
          <a href="https://github.com/bxcodec/github-readme-medium-recent-article">
            <code className={styles.code}>
              https://github.com/bxcodec/github-readme-medium-recent-article
            </code>
          </a>
        </p>
      </div>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/example.png"
          alt="Example Readme"
          width={862}
          height={409}
        />
      </div>
    </main>
  );
}
