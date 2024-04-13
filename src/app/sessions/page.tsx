import SessionBooker from "@/components/SessionBooker";

export default function Home() {
  return (
    <main className="flex h-[calc(100vh-75px)] flex-col items-center justify-between">
      <SessionBooker />
    </main>
  );
}
