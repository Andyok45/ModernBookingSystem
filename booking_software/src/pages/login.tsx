import dynamic from "next/dynamic";

// 👇 Load the component client-side only to avoid hydration issues
const Login = dynamic(() => import("@/components/Login"), {
  ssr: false,
});

export default function LoginPage() {
  return <Login />;
}
