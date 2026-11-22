'use client';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { THEMES } from "../page";
import { toPng } from 'html-to-image';

const TIERS = [
    { letra: "S", cor: "from-red-500 to-red-500/40" },
    { letra: "A", cor: "from-orange-500 to-orange-500/40" },
    { letra: "B", cor: "from-yellow-500 to-yellow-500/40" },
    { letra: "C", cor: "from-lime-500 to-lime-500/40" },
    { letra: "D", cor: "from-green-500 to-green-500/40" },
    { letra: "F", cor: "from-indigo-500 to-indigo-500/40" },
];

const LETRAS = TIERS.map((t) => t.letra);
const TIERS_VAZIAS = { S: [], A: [], B: [], C: [], D: [], F: [] };

function CartaoPokemon({ p, selecionado, aoClicar }) {
    return (
        <img
            src={p.imagem}
            alt={p.nome}
            crossOrigin="anonymous"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(p.id))}
            onClick={(e) => {
                e.stopPropagation();
                aoClicar(p.id);
            }}
            className={`w-14 h-14 md:w-30 md:h-30 object-contain cursor-pointer select-none [-webkit-touch-callout:none] rounded-xl transition ${selecionado ? "ring-4 ring-primary bg-white/30 scale-110" : ""}`}
        />
    );
}

export default function TierLists() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [theme, setTheme] = useState("aero");

    const [salvos, setSalvos] = useState([]);
    const [tiers, setTiers] = useState(TIERS_VAZIAS);
    const [nome, setNome] = useState("");
    const [carregado, setCarregado] = useState(false);
    const areaRef = useRef(null);
    const [selecionado, setSelecionado] = useState(null);

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

    useEffect(() => {
        setSalvos(JSON.parse(localStorage.getItem("myPokemon") || "[]"));

        const guardada = JSON.parse(localStorage.getItem("tierList") || "null");
        if (guardada) {
            setTiers(guardada.tiers);
            setNome(guardada.nome);
        }
        setCarregado(true);
    }, []);

    useEffect(() => {
        if (!carregado) return;
        localStorage.setItem("tierList", JSON.stringify({ nome, tiers }));
    }, [nome, tiers, carregado]);

    function mover(id, destino) {
        setTiers((atual) => {
            const novo = {};

            for (const t of LETRAS) novo[t] = atual[t].filter((x) => x !== id);

            if (destino !== "pool") novo[destino] = [...novo[destino], id];
            return novo;
        });
    }

    useEffect(() => {
        const aoArrastar = (e) => {
            const margem = 150;
            const vel = 5;
            if (e.clientY < margem) window.scrollBy(0, -vel);
            else if (window.innerHeight - e.clientY < margem) window.scrollBy(0, vel);

            if (e.clientX < margem) window.scrollBy(-vel, 0);
            else if (window.innerWidth - e.clientX < margem) window.scrollBy(vel, 0);
        };
        window.addEventListener("dragover", aoArrastar);
        return () => window.removeEventListener("dragover", aoArrastar);
    }, []);

    function aoSoltar(e, destino) {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData("text/plain"));
        if (id) mover(id, destino);
    }

    async function salvarImagem() {
        if (!areaRef.current) {
            alert("Falta ligar o ref: ponha ref={areaRef} na div #tierList");
            return;
        }

        setSelecionado(null);
        await new Promise((r) => setTimeout(r, 50));

        try {
            const url = await toPng(areaRef.current, {
                backgroundColor: "#black",
                pixelRatio: 2,
                cacheBust: true,
            });
            const a = document.createElement("a");
            a.download = `${nome.trim() || "tier-list"}.png`;
            a.href = url;
            a.click();
            WebsiteSoundsystem("/Save.mp3");
        } catch (err) {
            console.error("Erro ao gerar a imagem:", err);
            alert("Não foi possível gerar a imagem. Abra o console (F12) para ver o erro.");
        }
    }

    function aoClicarPokemon(id) {
        setSelecionado((atual) => (atual === id ? null : id));
    }

    function aoClicarZona(destino) {
        if (selecionado === null) return;
        mover(selecionado, destino);
        setSelecionado(null);
    }

    function WebsiteSoundsystem(audioName) {
        const snd = new Audio(audioName);
        snd.volume = 0.25;
        snd.play();
        snd.currentTime = 0;
    }

    const porId = Object.fromEntries(salvos.map((p) => [p.id, p]));
    const colocados = new Set(LETRAS.flatMap((t) => tiers[t]));
    const naoColocados = salvos.filter((p) => !colocados.has(p.id));

    return (

        <div id="body" data-theme={theme} className="relative isolate font-sans overflow-x-clip">
            {Object.entries(THEMES).map(([key, t]) => (
                <div
                    key={key}
                    className={`fixed inset-0 -z-10 bg-cover bg-center md:bg-size-[100%_auto] md:bg-repeat-y md:bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <div id="header" className="grid justify-center rounded-b-2xl px-3 pb-5 pt-20 md:pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex justify-center text-center text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-6 h-6 md:w-10 md:h-10 justify-self-end self-center" />TIER LISTS <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-6 h-6 md:w-10 md:h-10 justify-self-end self-center" /></h1>
                    <h1 className="text-center text-sm md:text-base text-primary font-bold text-shadow-lg/30 text-shadow-shade">(Your Pokémon appear at the very bottom. Drag them (or tap them) give the tier list a name and save it as an image!)</h1>
                </header>
            </div>

            <div id="mainContent" className="flex flex-col items-center px-3 md:px-6 pt-8 md:pt-16 pb-10">

                <div ref={ref} id="dropdownTools" className="fixed left-3 top-3 md:left-6 md:top-32.5 z-50">

                    <button onClick={() => {
                        setOpen((o) => !o)
                        WebsiteSoundsystem("/DropdownClick.mp3")
                    }} id="dropdownBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                        <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_book_2.ico" alt="" className="p-2" />
                    </button>

                    <div id="dropdownContent" className={`absolute left-0 top-full mt-2 w-[min(21.25rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-5.5rem)] md:max-h-[calc(100dvh-13rem)] overflow-y-auto overflow-x-hidden overscroll-contain grid border-2 border-accent rounded-xl bg-linear-to-br from-white/90 to-primary/90 p-4 gap-4 origin-top-left transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <h1 className="flex text-center text-2xl md:text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Tools</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <Link href="/" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Starter Page <img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10" /></Link>
                        <Link href="/MyPokemon" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">My Pokémon <img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/TierLists" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Tier Lists <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/Notes" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Notes <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <br />
                        <h1 className="flex text-center text-2xl md:text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Website Styles</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("aero"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-indigo-200 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Aero Scape<img src="https://em-content.zobj.net/source/apple/325/bubbles_1fae7.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("dorfic"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-orange-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">DORFic Lounge<img src="https://png.pngtree.com/png-clipart/20250105/original/pngtree-summer-fruit-fresh-orange-half-orange-png-image_6792015.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("jellyfishes"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-2xl md:text-3xl font-semibold text-violet-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Violet Jellyfishes<img src="https://png.pngtree.com/png-clipart/20250513/original/pngtree-vibrant-purple-jellyfish-png-image_20957555.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-400 mb-8 p-2">
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="✏️Name Your Tier List..."
                        className="underline underline-offset-4 justify-self-start w-full md:w-100 text-xl md:text-2xl font-semibold text-primary mr-2 outline-hidden border-3 border-primary rounded-3xl p-4"
                    />
                    <button onClick={() => { salvarImagem(); }} className="justify-self-end w-full md:w-50 bg-linear-to-tl from-sky-400 to-white border-2 border-primary rounded-xl text-2xl md:text-3xl text-primary font-bold p-1 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg text-center"><h1 className="grid">Save Image</h1></button>
                </div>

                <div id="tierListsContainer" className="border-3 border-accent w-full max-w-400 grid grid-cols-1 pt-8 md:pt-16 transition-all duration-300 ease-in-out md:hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-3 md:p-8">

                    <br />
                    <div id="tierList" ref={areaRef} className="justify-self-center w-full min-w-0 max-w-350 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-3 md:p-10">

                        {nome.trim() !== "" && (
                            <h2 className="whitespace-pre-wrap wrap-anywhere text-center text-3xl md:text-6xl font-bold text-primary pb-8">{nome}</h2>
                        )}

                        <div className="grid grid-cols-1 gap-3 md:gap-6">
                            {TIERS.map(({ letra, cor }) => (
                                <div
                                    key={letra}
                                    id={`rank${letra}`}
                                    onClick={() => aoClicarZona(letra)}
                                    className="flex w-full max-w-300 justify-self-center shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light"
                                >
                                    {/* Quadrado colorido com a letra */}
                                    <p className={`bg-linear-to-br ${cor} w-16 h-16 md:w-35 md:h-35 shrink-0 text-center text-3xl md:text-6xl text-white content-center rounded-3xl`}>
                                        {letra}
                                    </p>

                                    {/* Zona onde se solta os Pokémon */}
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => aoSoltar(e, letra)}
                                        className="flex-1 flex flex-wrap items-center gap-2 p-2"
                                    >
                                        {tiers[letra]
                                            .map((id) => porId[id])
                                            .filter(Boolean)
                                            .map((p) => (
                                                <CartaoPokemon key={p.id} p={p} selecionado={selecionado === p.id} aoClicar={aoClicarPokemon} />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <br /><br />

                </div>

                <div id="pokemonContainerRankable" className="mt-5 w-full max-w-400 justify-center pt-6 md:pt-10 transition-all duration-300 ease-in-out shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-4 md:p-16">
                    <h1 className="pb-4 text-center text-2xl md:text-4xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold">
                        All of Your Pokémon Will Appear Here!
                    </h1>
                    <h1 className="mb-5 text-center text-sm md:text-base text-primary font-bold text-shadow-lg/30 text-shadow-shade">Drag the Pokémon to the rank you want, or simply tap it and then tap the place it deserves!</h1>

                    {selecionado !== null && (
                        <p className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-max max-w-[90vw] rounded-xl px-4 py-2 bg-black/70 text-white text-center">
                            Tap a tier to place it · Tap the Pokémon again to cancel
                        </p>
                    )}

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => aoClicarZona("pool")}
                        onDrop={(e) => aoSoltar(e, "pool")}
                        className="flex flex-wrap justify-center gap-3 min-h-32"
                    >
                        {carregado && salvos.length === 0 && (
                            <p className="text-lg md:text-2xl text-primary">
                                You have no saved Pokémon yet.{" "}
                                <Link href="/" className="underline">Search for one</Link> and save it first!
                            </p>
                        )}

                        {naoColocados.map((p) => (
                            <CartaoPokemon key={p.id} p={p} selecionado={selecionado === p.id} aoClicar={aoClicarPokemon} />
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
}