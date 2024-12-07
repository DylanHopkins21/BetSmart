import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Modal from "../components/wagerModal/wagerModal";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/login", 
      permanent: false,         
    },
  };
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <div className="style1">
        <h1 id="test">BetSmart</h1>
        <h3>Bet on Grades</h3>
        <p>Made by: Siya, Audrey, Dylan, and Mohammed</p>
        <main>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      {isOpen && <Modal setIsOpen={setIsOpen} />}
    </main>
      </div>
    </>
  );
}


