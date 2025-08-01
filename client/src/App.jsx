import { useState } from "react";
import InstructionsTab from "./tabs/InstructionsTab";
import ContactTab from "./tabs/ContactTab";
import HomeTab from "./tabs/HomeTab";
import "./App.css";

function App() {
  // const APILINK = "https://chem-graph.onrender.com";
  // const APILINK = "http://localhost:5000";
  const APILINK =
    "https://vpqebjeug2dtqoi3exx6nlfdta0jnxyl.lambda-url.us-east-1.on.aws";

  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="bg-gray-100 min-h-screen font-serif text-black">
      <header className="bg-blue-700 text-white py-4">
        <div className="w-full px-[2cm] flex justify-between items-center">
          <h1 className="text-3xl font-bold">ChemGraphX</h1>
          <nav className="space-x-6">
            <button onClick={()=>setActiveTab('home')} className="hover:underline">Home</button>
            <button onClick={()=>setActiveTab('instructions')} className="hover:underline">Instructions</button>
            <button onClick={()=>setActiveTab('contact')} className="hover:underline">Contact</button>
          </nav>
        </div>
      </header>
      <main className="w-full px-[2cm] py-16">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'instructions' && <InstructionsTab />}
        {activeTab === 'contact' && <ContactTab />}
      </main>
      <footer className="text-center py-4 text-gray-600">&copy; 2025 ChemGraphX v1.0.</footer>
    </div>
  );
}

export default App;
