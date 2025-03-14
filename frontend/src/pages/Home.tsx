import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:3001/');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error loading message');
      }
    };

    fetchMessage();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-screen bg-slate-50">
      <h1 className="text-4xl font-bold">Welcome to Our App</h1>
      <p className="text-lg text-gray-600">{message}</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
