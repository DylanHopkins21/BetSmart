import Head from "next/head";
import Sidebar from "../components/navbar/sidebar";

export default function Home() {
  return (
    <>
      <Head>
        <title>BetSmart</title>
      </Head>
      <div style={{ padding: "1rem" }}>
        <h1>BetSmart</h1>
        <h3>Bet on Gradescope</h3>
        <p>Made by: Siya, Audrey, Dylan, and Mohammed</p>
      </div>
    </>
  );
}
