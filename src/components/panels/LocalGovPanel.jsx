"use client";
import { useState } from "react";
import TopNav from "../../components/TopNav";
import Danisman from "../../components/tabs/Danışman";
import BelgeAnalizi from "../../components/tabs/BelgeAnalizi";
import RaporOlustur from "../../components/tabs/RaporOlustur";
import Placeholder from "../../components/tabs/Placeholder";

const MENU = ["Dashboard", "Danışman", "Kent Politikaları", "Belediye Bütçe Analizi", "Hizmet Analizi", "Rapor Oluştur", "İyi Uygulamalar"];

export default function LocalGovPanel(props) {
  const [active, setActive] = useState(MENU[0]);
  return <>
    <TopNav {...props} menuItems={MENU} activeItem={active} onSelect={setActive} />
    {active === "Danışman" && <Danisman {...props} />}
    {active === "Belediye Bütçe Analizi" && <BelgeAnalizi {...props} />}
    {active === "Rapor Oluştur" && <RaporOlustur {...props} />}
    {active === "Dashboard" && <Placeholder title="Dashboard - Hoş geldiniz" />}
    {active !== "Danışman" && active !== "Belediye Bütçe Analizi" && active !== "Rapor Oluştur" && active !== "Dashboard" && <Placeholder title={active} />}
  </>;
}
