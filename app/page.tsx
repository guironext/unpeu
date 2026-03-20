import BestSellers from "@/components/BestSellers";
import Destockage from "@/components/Destockage";
import { Hero } from "@/components/Hero";
import MenuIcons from "@/components/MenuIcons";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Product sections will go here */}
        <Destockage />
        <MenuIcons/>
        <BestSellers/>
      </div>
    </>
  );
}
