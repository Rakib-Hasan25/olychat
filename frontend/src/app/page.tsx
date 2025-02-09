import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
    <Button>Hi </Button>
    <Link href="/auth/login" className="bg-blue-500 text-white px-6 py-2 rounded">
          Get Started
        </Link>
    </main>
  );
}
