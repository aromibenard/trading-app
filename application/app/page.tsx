import Link from "next/link";

export default function Home() {
  return (
    <div className="grid items-center place-content-center h-dvh">
      <Link href={'/dashboard'} className="bg-green-400 p-3 shadow rounded">Dashboard</Link>
    </div>
  )
}
