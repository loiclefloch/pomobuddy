import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Timer, Coffee } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="min-h-screen bg-cozy-bg flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-3 mb-4">
        <Timer className="size-10 text-cozy-accent" />
        <h1 className="text-4xl font-heading text-cozy-text">
          Welcome to test-bmad!
        </h1>
        <Coffee className="size-10 text-cozy-success" />
      </div>

      <p className="text-cozy-muted mb-8">Your cozy focus companion</p>

      <form
        className="flex gap-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          className="px-4 py-2 bg-cozy-surface text-cozy-text border border-cozy-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cozy-accent"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit">Greet</Button>
      </form>
      <p className="text-cozy-success">{greetMsg}</p>
    </main>
  );
}

export default App;
