import Image from "next/image";

export default function Home() {
  return (
    <div className="relative bg-lime-300">

      <div id="Header" className="flex grid justify-center bg-cyan-300 rounded-b-2xl pb-3 shadow-xl">
        <h1 className="text-center text-9xl text-lime-400 font-bold text-shadow-lg/30 text-shadow-emerald-950">MURADEX</h1>
        <h2 className="text-center text-3xl text-lime-300 text-shadow-lg/30 text-shadow-emerald-950">Welcome Trainers!</h2>
        <h5 className="text-center text-lg text-lime-300 text-shadow-lg/30 text-shadow-emerald-950 underline font-semibold">Search, Study, Rank and Write about Pokémon</h5>
      </div>

      <div id="MainBody" className="flex">
          
      </div>

    </div>
  );
}
