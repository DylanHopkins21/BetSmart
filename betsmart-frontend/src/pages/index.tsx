import Head from "next/head";
import CreateWagerConfigs from "@/components/createWagerConfigs/CreateWagerConfigs";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <CreateWagerConfigs/>
      
      {/* <div>
        <h1>BetSmart</h1>
        <h3>Bet on Gradescope</h3>
        <p>Made by: Siya, Audrey, Dylan, and Mohammed</p>
      </div> */}
    </>
  );
}
