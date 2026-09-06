import { SideBar } from "../../components/clients/CategoryProducts/sideBar"
import Hero from "../../components/clients/CategoryProducts/Hero"

export default function CategoryProducts(){
    return(
        <div className="max-w-[1480px] mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
            <SideBar />
            <div className="flex-1 w-full">
                <Hero />
            </div>
        </div>
    )
}