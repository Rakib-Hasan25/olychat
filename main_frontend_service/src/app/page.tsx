import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Welcome to Ultimate Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Experience seamless communication with our modern chat platform. Connect, collaborate, and chat with anyone, anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
           
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Real-time Chat</h3>
              <p className="text-gray-600">Instant messaging with real-time updates and notifications</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-gray-600">End-to-end encryption for all your conversations</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface designed for the best user experience</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
