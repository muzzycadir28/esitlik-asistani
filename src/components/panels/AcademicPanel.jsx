"use client";
import { useState } from "react";
import TopNav from "../../components/TopNav";
import Danisman from "../../components/tabs/Danışman";
import BelgeAnalizi from "../../components/tabs/BelgeAnalizi";
import Placeholder from "../../components/tabs/Placeholder";

const MENU = ["Danışman", "KEEDB Bilgi Merkezi", "Analiz Araçları", "Vaka Çalışmaları", "Akademik Kaynaklar"];

export default function AcademicPanel(props) {
  const [active, setActive] = useState(MENU[0]);
  return <>
    <TopNav {...props} menuItems={MENU} activeItem={active} onSelect={setActive} />
    {active === "Danışman" && <Danisman {...props} />}
    {active === "Analiz Araçları" && <BelgeAnalizi {...props} />}
    {active !== "Danışman" && active !== "Analiz Araçları" && <Placeholder title={active} />}
  </>;
}
