import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "../components/navbar/sidebar";

export default function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = true; 

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {isLoggedIn && (
        <div style={{ flex: "0 0 250px", backgroundColor: "#00171F" }}>
          <Sidebar />
        </div>
      )}
      <div style={{ flex: 1, padding: "2rem", backgroundColor: "#f9fafb", overflowY: "auto" }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
