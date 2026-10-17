'use client';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { THEMES } from "../page";

export default function TierLists(){
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

            <div id="header" className="grid justify-center rounded-b-2xl pb-5 pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end self-center" />TIER LISTS <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
                </header>
            </div>

            <div id="mainContent" className="grid justify-center pt-16 pb-10">

                <div ref={ref} id="dropdownTools" className="fixed left-6 top-32.5 z-50">

                    <button onClick={() => {
                        setOpen((o) => !o)
                        menuSound()
                    }} id="dropdownBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                        <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_book_2.ico" alt="" className="p-2" />
                    </button>

                    <div id="dropdownContent" className={`absolute left-0 top-full mt-2 w-85 grid border-2 border-accent rounded-xl bg-linear-to-br from-white/50 to-white/0 p-4 gap-4 origin-top-left transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Tools</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <a href="/" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Starter Page <img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10" /></a>
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

                <div id="tierListsContainer" className="border-3 border-accent w-400 grid justify-center pt-16 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">
                    <div className="grid grid-cols-2">
                        <input type="text" placeholder="✏️Name Your Tier List..." required className="underline underline-offset-4 justify-self-start w-100 text-2xl font-semibold text-primary ronded-xl mr-2  outline-hidden border-3 border-primary rounded-3xl p-4" />
                        <button className="justify-self-end w-50 bg-linear-to-tl from-sky-400 to-white border-2 border-primary rounded-xl text-3xl text-primary font-bold p-1 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg text-center"><h1 className="grid">Save Image</h1></button>
                    </div>

                    <br />
                    <div id="tierList" className="w-350 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-10">

                        <div id="rankS" className="grid grid-rows w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light">
                            <p className="bg-linear-to-br from-red-500 to-red-500/40 w-35 h-35 text-center text-6xl text-white content-center rounded-3xl">S</p>

                        </div>

                        <br />

                        <div id="rankA" className="grid grid-rows w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light">
                            <p className="bg-linear-to-br from-orange-500 to-orange-500/40 w-35 h-35 text-center text-6xl text-white content-center rounded-3xl">A</p>

                        </div>

                        <br />

                        <div id="rankB" className="grid grid-rows w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light">
                            <p className="bg-linear-to-br from-yellow-500 to-yellow-500/40 w-35 h-35 text-center text-6xl text-white content-center rounded-3xl">B</p>

                        </div>

                        <br />

                        <div id="rankC" className="grid grid-rows w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light">
                            <p className="bg-linear-to-br from-lime-500 to-lime-500/40 w-35 h-35 text-center text-6xl text-white content-center rounded-3xl">C</p>

                        </div>

                        <br />

                        <div id="rankD" className="grid grid-rows w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light">
                            <p className="bg-linear-to-br from-green-500 to-green-500/40 w-35 h-35 text-center text-6xl text-white content-center rounded-3xl">D</p>

                        </div>

                        <br />

                        <div id="rankF" className="grid grid-rows w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light">
                            <p className="bg-linear-to-br from-indigo-500 to-indigo-500/40 w-35 h-35 text-center text-6xl text-white content-center rounded-3xl">F</p>

                        </div>

                    </div>
                </div>
                    <br /><br />
                <div id="pokemonContainerRankable" className="w-400 justify-center pt-10 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">
                    <h1 className=" pb-4 text-center text-4xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold">All of Your Rankable Pokémon Will Appear Here!</h1>
                </div>

            </div>
        </div>
    );
}