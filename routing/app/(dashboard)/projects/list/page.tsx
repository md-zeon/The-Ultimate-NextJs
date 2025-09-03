import Link from "next/link";
import React from "react";
import styles from '../projects.module.css';

const ProjectList = () => {
  return (
    <main>
      <h1>Project List</h1>
        <ul className={styles.ul}>
          <Link href="/projects/jobit">
            <li>JobIt</li>
          </Link>
          <Link href="/projects/carrent">
            <li>Carrent</li>
          </Link>
          <Link href="/projects/hipnode">
            <li>Hipnode</li>
          </Link>
        </ul>
    </main>
  );
};

export default ProjectList;
