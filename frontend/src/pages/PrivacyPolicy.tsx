

export default function PrivacyPolicy() {
  return (
    <section className="mt-6 sm:mt-10 mb-16">
      <div className="max-w-[820px] mx-auto px-4">
        <div className="bg-[#1E3A6E] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">Politique de confidentialité</h3>
          <p className="text-sm opacity-80 mt-1">Lmoch.com — Dernière mise à jour : 6 septembre 2026</p>
        </div>

        <div className="space-y-5">

          <Card title="1. Introduction">
            <p>
              Lmoch.com (« nous », « notre » ou « nos ») exploite le site web et l'application
              mobile Lmoch, une plateforme de vente en ligne d'accessoires et de produits pour
              animaux de compagnie destinée au marché marocain.
            </p>
            <p className="mt-3">
              Cette politique de confidentialité décrit comment nous collectons, utilisons,
              stockons et protégeons vos informations personnelles lorsque vous utilisez notre
              site web ou notre application mobile (ci-après « le Service »).
            </p>
            <p className="mt-3">
              En utilisant le Service, vous acceptez la collecte et l'utilisation d'informations
              conformément à cette politique.
            </p>
          </Card>

          <Card title="2. Informations que nous collectons">
            <p>Lors de la création de votre compte, nous collectons :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Nom complet</strong></li>
              <li><strong>Numéro de téléphone</strong></li>
              <li><strong>Adresse e-mail</strong></li>
              <li><strong>Mot de passe</strong> (stocké de façon chiffrée/hachée — nous n'avons jamais accès à votre mot de passe en clair)</li>
            </ul>
            <p className="mt-4">Lors de vos commandes, nous collectons également :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Adresse de livraison</strong> et ville, nécessaires à l'expédition de votre commande</li>
              <li><strong>Historique des commandes :</strong> produits achetés, quantités, montants, dates et statut</li>
              <li><strong>Communications</strong> que vous nous envoyez via le service client</li>
              <li><strong>Informations techniques</strong> (adresse IP, type d'appareil et de navigateur) à des fins de sécurité</li>
            </ul>
            <div className="bg-[#FFF3EC] border-l-4 border-[#FF7A45] rounded-lg px-4 py-3 mt-4 text-sm">
              Nous ne collectons <strong>aucune donnée de géolocalisation précise</strong>. Seule
              l'adresse de livraison que vous saisissez manuellement est utilisée pour l'expédition
              de vos commandes.
            </div>
          </Card>

          <Card title="3. Comment nous utilisons vos informations">
            <p>Vos informations sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter, préparer et livrer vos commandes</li>
              <li>Vous contacter au sujet de votre commande (confirmation, suivi, service client)</li>
              <li>Améliorer la qualité de notre catalogue de produits et de notre service</li>
              <li>Assurer la sécurité de votre compte et prévenir la fraude</li>
            </ul>
            <p className="mt-3">
              Le paiement s'effectue actuellement <strong>à la livraison (paiement en espèces)</strong> ;
              nous ne collectons donc pas d'informations de carte bancaire ou de paiement en ligne.
            </p>
          </Card>

          <Card title="4. Partage de vos informations">
            <p>
              Nous ne vendons, ne louons et ne partageons jamais vos informations personnelles avec
              des tiers à des fins commerciales ou publicitaires.
            </p>
            <p className="mt-3">Vos informations peuvent être partagées uniquement dans les cas suivants :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Avec notre équipe de livraison, dans la seule mesure nécessaire pour acheminer votre commande</li>
              <li>Si la loi ou une autorité compétente l'exige</li>
            </ul>
          </Card>

          <Card title="5. Outils d'analyse et de suivi publicitaire">
            <p>
              À la date de cette politique, Lmoch.com <strong>n'utilise aucun outil d'analyse ni de
              suivi publicitaire tiers</strong> (tel que Google Analytics ou Meta/Facebook Pixel).
              Si cela venait à changer, cette politique sera mise à jour en conséquence, et la
              nouvelle date de mise à jour sera indiquée en haut de cette page.
            </p>
          </Card>

          <Card title="6. Conservation des données">
            <p>
              Nous conservons vos informations personnelles aussi longtemps que votre compte est
              actif, ou aussi longtemps que nécessaire pour vous fournir nos services, respecter nos
              obligations légales, résoudre des litiges et faire appliquer nos accords.
            </p>
          </Card>

          <Card title="7. Sécurité de vos données">
            <p>
              Nous mettons en œuvre des mesures techniques raisonnables (chiffrement des mots de
              passe, connexions sécurisées HTTPS, authentification par jeton) pour protéger vos
              informations personnelles contre tout accès, modification, divulgation ou destruction
              non autorisés. Toutefois, aucune méthode de transmission ou de stockage électronique
              n'est totalement sécurisée à 100 %.
            </p>
          </Card>

          <Card title="8. Vos droits">
            <p>Vous disposez à tout moment du droit de :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Accéder aux informations personnelles que nous détenons à votre sujet</li>
              <li>Demander la correction de données inexactes</li>
              <li>Demander la suppression de votre compte et de vos données personnelles</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.</p>
          </Card>

          <Card title="9. Confidentialité des enfants">
            <p>
              Le Service ne s'adresse pas aux personnes de moins de 16 ans et nous ne collectons pas
              sciemment de données personnelles concernant des enfants. Si vous pensez qu'un enfant
              nous a fourni des informations personnelles, veuillez nous contacter afin que nous
              puissions les supprimer.
            </p>
          </Card>

          <Card title="10. Modifications de cette politique">
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute
              modification sera publiée sur cette page avec une nouvelle date de mise à jour.
            </p>
          </Card>

          <Card title="11. Nous contacter">
            <p>Pour toute question concernant cette politique ou vos données personnelles :</p>
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