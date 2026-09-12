

export default function Terms() {
    return (
        <section className="mt-6 sm:mt-10 mb-16">
            <div className="max-w-[820px] mx-auto px-4">
                <div className="bg-[#1E3A6E] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold">Conditions d'utilisation</h3>
                    <p className="text-sm opacity-80 mt-1">Lmoch.com — Dernière mise à jour : 6 septembre 2026</p>
                </div>

                <div className="space-y-5">

                    <Card title="1. Acceptation des conditions">
                        <p>
                            En créant un compte, en passant une commande ou en utilisant de toute autre manière le
                            site web ou l'application mobile Lmoch.com (« le Service »), vous acceptez d'être lié
                            par les présentes Conditions d'utilisation. Si vous n'acceptez pas ces conditions,
                            veuillez ne pas utiliser le Service.
                        </p>
                    </Card>

                    <Card title="2. Compte utilisateur et commande sans compte">
                        <p>
                            La création d'un compte n'est pas obligatoire pour passer commande : vous pouvez
                            commander en tant qu'invité en fournissant uniquement les informations nécessaires à la
                            livraison.
                        </p>
                        <p className="mt-3">
                            Créer un compte (nom complet, numéro de téléphone, adresse e-mail et mot de passe) reste
                            toutefois recommandé, car il vous permet de :
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1.5">
                            
                            <li>
                                Cumuler des <strong>points de fidélité</strong> : chaque tranche de 2000 DH d'achat
                                vous rapporte 50 points, équivalents à 50 DH de réduction utilisable sur une
                                prochaine commande.
                            </li>
                        </ul>
                        <ul className="list-disc pl-5 mt-3 space-y-1.5">
                            <li>Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité effectuée depuis votre compte.</li>
                            <li>Vous devez nous fournir des informations exactes et à jour.</li>
                            <li>Nous nous réservons le droit de suspendre ou de supprimer tout compte en cas d'utilisation frauduleuse ou abusive du Service, y compris en cas d'abus manifeste du programme de fidélité.</li>
                        </ul>
                    </Card>

                    <Card title="3. Commandes et disponibilité des produits">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Toute commande passée sur le Service constitue une offre d'achat, que nous nous réservons le droit d'accepter ou de refuser.</li>
                            <li>Les prix, descriptions et disponibilités des produits peuvent être modifiés sans préavis.</li>
                            <li>En cas de rupture de stock après confirmation de commande, nous vous contacterons pour vous proposer un remboursement, un produit de remplacement ou l'annulation de la commande.</li>
                        </ul>
                    </Card>

                    <Card title="4. Paiement et livraison">
                        <p>
                            Le paiement s'effectue actuellement <strong>à la livraison, en espèces</strong>. Aucune
                            information de carte bancaire n'est collectée par le Service.
                        </p>
                        <p className="mt-3">
                            Les délais de livraison sont communiqués à titre indicatif et peuvent varier selon la
                            ville et la disponibilité du transporteur. Lmoch.com ne pourra être tenu responsable
                            des retards indépendants de sa volonté (conditions météorologiques, grèves,
                            incidents logistiques, etc.).
                        </p>
                    </Card>

                    <Card title="5. Retours et remboursements">
                        <p>
                            Pour toute question relative à un retour, un produit défectueux ou un remboursement,
                            veuillez contacter notre service client à{" "}
                            <a href="mailto:lmochstore@gmail.com" className="text-[#FF7A45] font-semibold hover:underline">
                                lmochstore@gmail.com
                            </a>{" "}
                            dans les meilleurs délais après réception de votre commande.
                        </p>
                    </Card>

                    <Card title="6. Utilisation autorisée du Service">
                        <p>Vous vous engagez à ne pas :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1.5">
                            <li>Utiliser le Service à des fins illégales ou frauduleuses ;</li>
                            <li>Tenter d'accéder de façon non autorisée à nos systèmes ou aux comptes d'autres utilisateurs ;</li>
                            <li>Perturber le bon fonctionnement du Service (attaques, scripts automatisés, etc.) ;</li>
                            <li>Publier ou transmettre du contenu illicite, diffamatoire ou portant atteinte aux droits d'un tiers.</li>
                        </ul>
                    </Card>

                    <Card title="7. Propriété intellectuelle">
                        <p>
                            Le contenu du Service (logo, textes, images, mise en page, code) est la propriété de
                            Lmoch.com ou de ses fournisseurs et est protégé par les lois applicables en matière de
                            propriété intellectuelle. Toute reproduction ou utilisation non autorisée est
                            interdite.
                        </p>
                    </Card>

                    <Card title="8. Limitation de responsabilité">
                        <p>
                            Le Service est fourni « en l'état ». Dans la mesure permise par la loi, Lmoch.com ne
                            saurait être tenu responsable des dommages indirects résultant de l'utilisation ou de
                            l'impossibilité d'utiliser le Service.
                        </p>
                    </Card>

                    <Card title="9. Modification des conditions">
                        <p>
                            Nous pouvons modifier ces Conditions d'utilisation à tout moment. Toute modification
                            sera publiée sur cette page avec une nouvelle date de mise à jour. La poursuite de
                            l'utilisation du Service après modification vaut acceptation des nouvelles conditions.
                        </p>
                    </Card>

                    <Card title="10. Droit applicable">
                        <p>
                            Les présentes Conditions d'utilisation sont régies par le droit marocain. Tout litige
                            relatif à leur interprétation ou leur exécution relève de la compétence exclusive des
                            tribunaux marocains.
                        </p>
                    </Card>

                    <Card title="11. Nous contacter">
                        <p>Pour toute question concernant ces Conditions d'utilisation :</p>
                        <p className="mt-2">
                            📧 <a href="mailto:lmochstore@gmail.com" className="text-[#FF7A45] font-semibold hover:underline">
                                lmochstore@gmail.com
                            </a>
                        </p>
                        <p className="text-sm text-[var(--muted)] mt-1">Lmoch.com — Casablanca, Maroc</p>
                    </Card>

                </div>
            </div>
        </section>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-[#1E3A6E] font-bold text-base sm:text-lg mb-3 pb-2 border-b-2 border-[#FF7A45] inline-block">
                {title}
            </h2>
            <div className="text-sm sm:text-[15px] text-[#2B2B2B] leading-relaxed">
                {children}
            </div>
        </div>
    );
}