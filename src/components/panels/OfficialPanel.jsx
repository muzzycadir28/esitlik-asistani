"use client";
import { useState } from "react";
import TopNav from "../../components/TopNav";
import Danisman from "../../components/tabs/Danışman";
import BelgeAnalizi from "../../components/tabs/BelgeAnalizi";
import RehberKontrol from "../../components/tabs/RehberKontrol";
import RaporOlustur from "../../components/tabs/RaporOlustur";
import Placeholder from "../../components/tabs/Placeholder";

const MENU = ["Danışman", "Politika Tasarımı", "Belge Analizi", "Rehber & Kontrol Listeleri", "Rapor Oluştur", "Kaynaklar"];

export default function OfficialPanel(props) {
  const [active, setActive] = useState(MENU[0]);
  return <>
    <TopNav {...props} menuItems={MENU} activeItem={active} onSelect={setActive} />
    {active === "Danışman" && <Danisman {...props} />}
    {active === "Belge Analizi" && <BelgeAnalizi {...props} />}
    {active === "Rehber & Kontrol Listeleri" && <RehberKontrol {...props} />}
    {active === "Rapor Oluştur" && <RaporOlustur {...props} />}
    {active !== "Danışman" && active !== "Belge Analizi" && active !== "Rehber & Kontrol Listeleri" && active !== "Rapor Oluştur" && <Placeholder title={active} />}
  </>;
}
