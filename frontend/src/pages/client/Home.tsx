import HeroCarousel from "../../components/clients/Home/HeroCarousel"
import FeaturesMarquee from "../../components/clients/Home/FeaturesMarquee"
import Content from "../../components/clients/Home/Content"
import ServicesCarousel from "../../components/clients/Home/ServicesCarousel"
import NewsletterBanner from "../../components/clients/Home/NewsletterBanner"
import { useState, useEffect } from "react"
import type { Product } from "../../types/Clients"
import { getChatJouets, getChienJouets, getTopCustomers,getRandomProducts } from "../../api/ClientServices"
import TopCustomersBanner from "../../components/clients/Home/TopCustomer"

type TopCustomer = { id: number; name: string; total_spent: string | number; orders_count: number }

export default function Home() {
    const [chatJouets, setChatJouets] = useState<Product[]>([])
    const [chienJouets, setChienJouets] = useState<Product[]>([])
    const [randomProducts, setRandomProducts] = useState<Product[]>([])
    const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])

    useEffect(() => {
        const fetchChatJouet = async () => {
            try {
                const res = await getChatJouets()
                setChatJouets(res.data.data)
            } catch (error) {
                console.error("Erreur lors de la récupération des jouets :", error)
            }
        }

        fetchChatJouet()
    }, [])
    useEffect(() => {
        const fetchChienJouet = async () => {
            try {
                const res = await getChienJouets()
                setChienJouets(res.data.data)
            } catch (error) {
                console.error("Erreur lors de la récupération des jouets :", error)
            }
        }

        fetchChienJouet()
    }, [])
    useEffect(() => {
        const fetchTopCustomers = async () => {
            try {
                const res = await getTopCustomers()
                setTopCustomers(res.data.data)
            } catch (error) {
                console.error("Erreur lors de la récupération des meilleurs clients :", error)
            }
        }
        fetchTopCustomers()
    }, [])
    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const res = await getRandomProducts()
                setRandomProducts(res.data.data)
            } catch (error) {
                console.error("Erreur lors de la récupération des produits aléatoires :", error)
            }
        }
        fetchRandomProducts()
    }, [])

    return (
        <>
            <HeroCarousel />
            <FeaturesMarquee />
            <TopCustomersBanner customers={topCustomers} />
            <Content jouetsChat={chatJouets} jouetsChien={chienJouets} randomProducts={randomProducts} />
            <ServicesCarousel />
            <NewsletterBanner />
        </>
    )
}