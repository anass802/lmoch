import { useState } from "react";
import { Capacitor } from '@capacitor/core';
import { NewsletterSubscriber } from "../../../api/ClientServices";


const InstagramIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);
export default function NewsletterBanner() {
    const [email, setEmail] = useState("");
    

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try{
            const res=await NewsletterSubscriber(email)
            if(res.data.message==='Subscribed successfully'){
                alert(res.data.message)
            }

        }catch(err){
            console.error(err)
        }
        console.log("Inscription:", email);
    };

    return (
        <section className="max-w-[1280px] mx-auto px-4 py-10">
            <div className="relative overflow-hidden rounded-[28px] bg-[#1E3A6E] px-8 py-14 md:px-16 md:py-16 text-center">
                {/* dotted texture, identique au style des autres sections */}
                <div
                    className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,255,255,0.6) 1.4px, transparent 1.4px)",
                        backgroundSize: "20px 20px",
                    }}
                />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                        Restez informé de nos nouveautés{" "}
                        <span role="img" aria-label="pattes">🐾</span>
                    </h2>
                    <p className="text-[#C3CEE3] text-base md:text-lg mb-8">
                        Recevez nos meilleures offres et conseils directement dans votre boîte mail.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            className="flex-1 bg-white text-[#2a2528] placeholder-gray-400 rounded-full px-6 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-[#FF7A45]/50 transition-shadow"
                        />
                        <button
                            type="submit"
                            className="bg-[#FF7A45] hover:bg-[#FF6A2E] text-white font-semibold px-8 py-3.5 rounded-full transition-colors whitespace-nowrap"
                        >
                            Être alerté
                        </button>
                    </form>
                   

                </div>
                 <div className="relative z-10 max-w-2xl mx-auto flex justify-center">
                        {Capacitor.isNativePlatform() && (
                            <button
                                onClick={() => window.open("https://www.instagram.com/ztx_tech/", "_blank")}
                                className="flex items-center gap-1.5 text-[#8896B3] text-sm hover:text-white transition-colors cursor-pointer mt-3"
                            >
                                Made by <span className="font-medium">ztx</span>
                                <InstagramIcon width={14} height={14} />
                            </button>
                        )}
                    </div>
            </div>
        </section>
    );
}