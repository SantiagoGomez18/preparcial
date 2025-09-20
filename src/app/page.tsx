import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link href="/crear">Crear Autor</Link>
      </button>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link href="/authors">Lista de Autores</Link>
      </button>
    </main>
  );
}
