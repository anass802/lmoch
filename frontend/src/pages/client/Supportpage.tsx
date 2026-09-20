

const SUPPORT_EMAIL = "lmochstore@gmail.com";
const NAVY = "#16274b";
const ORANGE = "#ee6c2f";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f1] text-[#1c2b3a]">

      <main className="mx-auto max-w-4xl px-6 pb-24">
        {/* Navy banner, matching the Politique de confidentialité page */}
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-12 text-white sm:px-14 sm:py-16"
          style={{ backgroundColor: NAVY }}
        >
          <PawField />
          <p
            className="relative text-3xl sm:text-4xl"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
          >
            Besoin d'aide ?
          </p>
          <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-[#c3cee0]">
            Commande, livraison ou question sur un produit pour votre
            compagnon — notre équipe vous répond directement par e-mail.
          </p>
        </div>

        {/* Contact card */}
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 sm:p-10">
          <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <p
                className="text-lg"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Écrivez-nous à tout moment
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm text-[#3d4c5e]">
                  <Paw />
                  Suivi de commande et livraison
                </li>
                <li className="flex items-start gap-3 text-sm text-[#3d4c5e]">
                  <Paw />
                  Retours, échanges et remboursements
                </li>
                <li className="flex items-start gap-3 text-sm text-[#3d4c5e]">
                  <Paw />
                  Votre compte et vos points de fidélité
                </li>
              </ul>
            </div>

            <div
              className="rounded-2xl p-6 text-center sm:p-8"
              style={{ backgroundColor: "#f7f5f1" }}
            >
              <p className="text-sm font-medium text-[#5b6b7d]">
                Notre adresse e-mail
              </p>
              <p
                className="mt-2 break-all text-lg"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: NAVY }}
              >
                {SUPPORT_EMAIL}
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                  "Demande d'assistance — Lmoch"
                )}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
                style={{ backgroundColor: ORANGE }}
              >
                Envoyer un e-mail
              </a>
              <p className="mt-3 text-xs text-[#8b98a8]">
                Réponse sous 24h en général
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Paw() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="#ee6c2f"
    >
      <circle cx="7" cy="7.5" r="2.1" />
      <circle cx="12.5" cy="5.3" r="2.1" />
      <circle cx="18" cy="7.5" r="2.1" />
      <path d="M12.5 10.2c-3.4 0-6.3 2.7-6.3 5.6 0 1.9 1.6 3.2 3.5 2.9 1-.1 1.8-.6 2.8-.6s1.8.5 2.8.6c1.9.3 3.5-1 3.5-2.9 0-2.9-2.9-5.6-6.3-5.6z" />
    </svg>
  );
}

function PawField() {
  // Subtle decorative paw pattern in the corner of the navy banner
  const paws = [
    { top: "10%", left: "78%", size: 22, rotate: -15, opacity: 0.12 },
    { top: "55%", left: "88%", size: 30, rotate: 10, opacity: 0.1 },
    { top: "75%", left: "68%", size: 16, rotate: -25, opacity: 0.1 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      {paws.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="white"
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <circle cx="7" cy="7.5" r="2.1" />
          <circle cx="12.5" cy="5.3" r="2.1" />
          <circle cx="18" cy="7.5" r="2.1" />
          <path d="M12.5 10.2c-3.4 0-6.3 2.7-6.3 5.6 0 1.9 1.6 3.2 3.5 2.9 1-.1 1.8-.6 2.8-.6s1.8.5 2.8.6c1.9.3 3.5-1 3.5-2.9 0-2.9-2.9-5.6-6.3-5.6z" />
        </svg>
      ))}
    </div>
  );
}