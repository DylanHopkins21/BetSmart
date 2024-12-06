import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "../components/navbar/sidebar";
import { UserProvider } from "../contexts/UserContext"; // Import the UserProvider
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoggedIn = router.pathname !== '/login';

  return (
    <UserProvider> {/* Wrap your app with UserProvider */}
      <div style={{ display: "flex", height: "100vh" }}>
        {isLoggedIn && (
          <div style={{ flex: "0 0 250px", backgroundColor: "#00171F" }}>
            <Sidebar />
          </div>
        )}
        <div style={{ flex: 1, backgroundColor: "#f9fafb", overflowY: "auto" }}>
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  );
}
