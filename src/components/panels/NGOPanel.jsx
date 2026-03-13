"use client";
import { useState } from "react";
import TopNav from "../../components/TopNav";
import Danisman from "../../components/tabs/Danışman";
import BelgeAnalizi from "../../components/tabs/BelgeAnalizi";
import RehberKontrol from "../../components/tabs/RehberKontrol";
import Placeholder from "../../components/tabs/Placeholder";

const MENU = ["Danışman", "Savunuculuk Rehberi", "İzleme Soruları", "Bütçe İzleme", "Stratejik Plan Analizi", "Kaynaklar"];

export default function NGOPanel(props) {
  const [active, setActive] = useState(MENU[0]);
  return <>
    <TopNav {...props} menuItems={MENU} activeItem={active} onSelect={setActive} />
    {active === "Danışman" && <Danisman {...props} />}
    {active === "İzleme Soruları" && <RehberKontrol {...props} />}
    {active === "Bütçe İzleme" && <BelgeAnalizi {...props} />}
    {active !== "Danışman" && active !== "İzleme Soruları" && active !== "Bütçe İzleme" && <Placeholder title={active} />}
  </>;
}
