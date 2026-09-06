import promo from '../../../assets/images/promo/46d5307c-2a8f-4bb2-aa28-b0acb697dd3d.png'

export default function PromoCarousel() {
    return (
        <section className="mt-4 sm:mt-6">
            <div className="max-w-[1280px] mx-auto px-3 sm:px-4">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#173E7D] aspect-[16/9] sm:aspect-[21/9]">
                    <img
                        src={promo}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    )
}