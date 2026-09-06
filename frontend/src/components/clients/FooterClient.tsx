import logo from "../../assets/images/logo/lmoch.png"

/* lucide-react ne fournit plus les icônes de marques (Instagram, Facebook, TikTok...)
   depuis ses versions récentes — on les dessine donc en SVG inline. */

const InstagramIcon = (props:any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const FacebookIcon = (props:any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.53c0-.86.24-1.44 1.47-1.44h1.57V4.46A21 21 0 0 0 14.2 4.3c-2.24 0-3.77 1.37-3.77 3.87v2.16H7.87v2.96h2.56V21h3.07Z" />
    </svg>
);

const TikTokIcon = (props:any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.6 5.82c-.6-.66-.98-1.5-1.03-2.42h-3.06v13.4c0 1.4-1.14 2.54-2.54 2.54a2.54 2.54 0 0 1 0-5.08c.24 0 .48.04.7.1v-3.1a5.63 5.63 0 0 0-.7-.04 5.65 5.65 0 1 0 5.65 5.65V9.4a8.68 8.68 0 0 0 5.03 1.6V7.94a5.68 5.68 0 0 1-4.05-2.12Z" />
    </svg>
);

export default function FooterClient() {
    const columns = [
        {
            title: "À propos",
            links: ["Notre histoire", "Nos marques", "Blog"],
        },
        {
            title: "Aide",
            links: ["Livraison", "Retours", "FAQ"],
        },
        {
            title: "Catégories",
            links: ["Chiens", "Chats", "Oiseaux"],
        },
    ];

    return (
        <footer className="bg-[#1E3A6E] pt-16 pb-8 px-6 md:px-16">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
                    {/* logo + description */}
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <img src={logo} alt="Lmoch" className="w-11 h-11 object-contain" />
                            <span className="logo-text text-white">
                                Lm<span className="text-[#FF7A45]">och.<span className="text-white">com</span></span>
                            </span>
                        </div>
                        <p className="text-[#A9B4CC] text-[15px] leading-relaxed max-w-[280px]">
                            Croquettes, jouets et accessoires premium pour vos compagnons, livrés partout au Maroc.
                        </p>
                    </div>

                    {/* link columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-white font-bold text-[15px] mb-4">{col.title}</h3>
                            <ul className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-[#A9B4CC] text-[15px] hover:text-white transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* divider */}
                <div className="h-px bg-white/10 my-10" />

                {/* bottom bar */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-center md:text-left">
                        <p className="text-[#8896B3] text-sm">
                            © 2026 Lmoch. Tous droits réservés.
                        </p>
                        <span className="hidden md:inline text-[#8896B3]/40 text-sm">·</span>
                        <button
                            onClick={() => window.open("https://www.instagram.com/ztx_tech/", "_blank")}
                            className="flex items-center gap-1.5 text-[#8896B3] text-sm hover:text-white transition-colors cursor-pointer"
                        >
                            Made by <span className="font-medium">ztx</span>
                            <InstagramIcon width={14} height={14} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.open("https://www.instagram.com/lmochstore/", "_blank")}
                            aria-label="Instagram"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                        >
                            <InstagramIcon width={16} height={16} />
                        </button>
                        <button onClick={() => window.open("https://web.facebook.com/profile.php?id=100079650670864", "_blank")}
                            aria-label="Facebook"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                        >
                            <FacebookIcon width={15} height={15} />
                        </button>
                        <button onClick={() => window.open("https://www.tiktok.com/@lmochoff", "_blank")}
                            aria-label="TikTok"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                        >
                            <TikTokIcon width={15} height={15} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}