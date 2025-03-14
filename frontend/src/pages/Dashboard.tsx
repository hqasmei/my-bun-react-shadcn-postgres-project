import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button asChild variant="outline">
            <Link to="/">Logout</Link>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
            <p className="text-gray-600">This is your personal dashboard where you can manage your account and view your data.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
