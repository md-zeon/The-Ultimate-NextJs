import Hello from "./components/hello";

export default function Home() {
  console.log("What am I? Server");
  return (
    <div>
      <h1>Welcome to Next js</h1>
      <Hello />
    </div>
  );
}
