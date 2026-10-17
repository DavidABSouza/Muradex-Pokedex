"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useRef, useEffect } from "react";

export const THEMES = {
  aero: { label: "Aero Scape", wallpaper: "bg-[url('/bg-starterpage.png')]" },
  dorfic: { label: "DORFic Lounge", wallpaper: "bg-[url('/bg-dorfic.png')]" },
  jellyfishes: { label: "Jellyfishes Glow", wallpaper: "bg-[url('/bg-jellyfishes.png')]" },
};

export default function Home() {

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [theme, setTheme] = useState("aero");


  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved && THEMES[saved]) setTheme(saved);
  }, []);

  const changeTheme = (key) => {
    setTheme(key);
    localStorage.setItem("theme", key);
  };

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function menuSound() {
    const snd = new Audio("/Click.mp3");
    snd.play();
    snd.currentTime = 0;
  }

  function clickSound() {
    const snd = new Audio("/Click2.wav");
    snd.play();
    snd.currentTime = 0;
  }

  return (

    <div id="body" data-theme={theme} className="relative isolate font-sans">
      {Object.entries(THEMES).map(([key, t]) => (
        <div
          key={key}
          className={`absolute inset-0 -z-10 bg-size-[100%_auto] bg-repeat-y bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div id="header" className="grid justify-center rounded-b-2xl pb-3 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
        <header>
          <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade tracking-widest"><img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10 justify-self-end self-center" />MURADEX <img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
          <h6 className="text-center text-lg text-primary text-shadow-lg/30 text-shadow-shade font-semibold">Search, Study, Rank and Write about Pokémon!</h6>
          <h2 className="text-center text-3xl text-primary text-shadow-lg/30 text-shadow-shade">Welcome Trainers!</h2>
        </header>
      </div>

      <div id="mainContent" className="grid justify-center pt-16 pb-10">

        <div ref={ref} id="dropdownTools" className="fixed left-6 top-20 z-50">

          <button onClick={() => {
            setOpen((o) => !o)
            menuSound()
          }} id="dropdownBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
            <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_book_2.ico" alt="" className="p-2" />
          </button>

          <div id="dropdownContent" className={`absolute left-0 top-full mt-2 w-85 grid border-2 border-accent rounded-xl bg-linear-to-br from-white/50 to-white/0 p-4 gap-4 origin-top-left transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
            <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Tools</h1> <hr className="h-2 rounded bg-accent border-0" />
            <a href="/" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Starter Page <img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10"/></a>
            <Link href="/MyPokemon" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">My Pokémon <img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end" /></Link>
            <Link href="/TierLists" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Tier Lists <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
            <Link href="/Notes" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Notes <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
            <br />
            <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Website Styles</h1> <hr className="h-2 rounded bg-accent border-0" />
            <a href="#" onClick={(e) => { e.preventDefault(); changeTheme("aero"); clickSound() }} className="rounded-xl flex text-start text-3xl font-semibold text-indigo-200 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Aero Scape<img src="https://em-content.zobj.net/source/apple/325/bubbles_1fae7.png" alt="" className="w-10 h-10 justify-self-end" /></a>
            <a href="#" onClick={(e) => { e.preventDefault(); changeTheme("dorfic"); clickSound() }} className="rounded-xl flex text-start text-3xl font-semibold text-orange-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">DORFic Lounge<img src="https://png.pngtree.com/png-clipart/20250105/original/pngtree-summer-fruit-fresh-orange-half-orange-png-image_6792015.png" alt="" className="w-10 h-10 justify-self-end" /></a>
            <a href="#" onClick={(e) => { e.preventDefault(); changeTheme("jellyfishes"); clickSound() }} className="rounded-xl flex text-start text-3xl font-semibold text-violet-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Violet Jellyfishes<img src="https://png.pngtree.com/png-clipart/20250513/original/pngtree-vibrant-purple-jellyfish-png-image_20957555.png" alt="" className="w-10 h-10 justify-self-end" /></a>
          </div>

        </div>

        <form action="" id="searchBar" className="flex border-4 border-accent rounded-xl p-6 bg-linear-to-br from-white/60 to-white/5 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
          <input type="text" className="w-200 text-2xl font-semibold text-primary ronded-xl mr-2  outline-hidden" placeholder="Search Pokémon by name, generation, type, entry number..." />
          <button type="submit" className="bg-linear-to-tl from-sky-400 to-white border-2 border-primary rounded-xl text-3xl text-primary font-bold p-1 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Search!</button>
        </form>

        <div id="generationSearch" className="justify-center pt-16 transition-all duration-300 ease-in-out hover:scale-102">

          <h1 className=" pb-4 text-center text-4xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold">Check Out Pokémon by their Generations!</h1>

          <div id="generationSearchContainers" className="shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 w-275 justify-items-center shadow-xl flex-row grid grid-cols-3 gap-8 p-4 border-4 border-accent rounded-3xl bg-blend-soft-light">

            <div id="gen1" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/b3/fb/ed/b3fbed0b161349a1e642ffcbec242ed7.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 1 Kanto Region</h2>
            </div>

            <div id="gen2" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/0c/d5/95/0cd595176b438f0691d180e2a0c95577.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 2 Johto Region</h2>
            </div>

            <div id="gen3" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/6c/21/0c/6c210c3c36e246cdec2820f71161271c.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 3 Hoenn Region</h2>
            </div>

            <div id="gen4" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/69/a8/10/69a810ee3a84b213bb798e5c05b6da07.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 w-54 text-shadow-lg/30">Generation 4 Sinnoh Region</h2>
            </div>

            <div id="gen5" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/8a/c3/b7/8ac3b7e1cada3de29beabdb98f36d055.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 5 Unova Region</h2>
            </div>

            <div id="gen6" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/4d/92/13/4d92132f8053c8ba12ca620b7cb4da40.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 6 Kalos Region</h2>
            </div>

            <div id="gen7" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/42/f8/dc/42f8dc53d855d2c1a6f3b64ba09609ac.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 7 Alola Region</h2>
            </div>

            <div id="gen8" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/81/bd/eb/81bdebccb9094228a46868ecfc0da807.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 8 Galar Region</h2>
            </div>

            <div id="gen9" className="p-10 w-75 bg-sky-400 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white to-sky-400">
              <img src="https://i.pinimg.com/1200x/25/7b/14/257b14cb732e996a81555711aa8acb19.jpg" alt="" className="w-75 rounded-xl" />
              <h2 className="text-center text-3xl text-primary font-bold p-1 text-shadow-lg/30">Generation 9 Paldea Region</h2>
            </div>

          </div>

        </div>

      </div>

      <div id="footer" className="grid justify-center p-10 rounded-t-2xl bg-linear-to-b from-white/70 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
        <footer className="flex gap-45">

          <img src="/MurasakiCreations.png" alt="Logo MC" className="w-25 h-25 rounded transition-all duration-300 ease-in-out hover:scale-102" />

          <a href="https://github.com/DavidABSouza" className="place-items-center w-20 h-20 text-3xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold transition-all duration-300 ease-in-out hover:scale-102">
            <img src="https://i.redd.it/lkyrwyojmjth1.png" alt="GitHub Logo" className="rounded-2xl" />
            <h1>GitHub</h1>
          </a>

          <a href="https://www.instagram.com/aru_murasaki/" className="place-items-center w-20 h-20 text-3xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold transition-all duration-300 ease-in-out hover:scale-102">
            <img src="https://i.pinimg.com/564x/bc/1a/71/bc1a710e5159a70c0dc15dab77a987f3.jpg" alt="Instagram Logo" className="rounded-2xl" />
            <h1 className="">Instagram</h1>
          </a>


          <a href="https://www.tiktok.com/@purpuraking__" className="place-items-center w-20 h-20 text-3xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold transition-all duration-300 ease-in-out hover:scale-102">
            <img src="https://i.pinimg.com/564x/e0/64/87/e06487db4c9a77d4f2644cf95e157e61.jpg" alt="TikTok" className="rounded-2xl" />
            <h1>TikTok</h1>
          </a>

          <img src="/PFSINDIE.jpg" alt="Logo PFS" className="w-25 h-25 rounded transition-all duration-300 ease-in-out hover:scale-102"/>
        </footer>
      </div>
    </div>
  );
}
