// components/clients/Home/PlayfulCat.tsx
import { useEffect, useRef } from "react";

export default function PlayfulCat() {
  const catRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const flRef = useRef<SVGGElement>(null);
  const brRef = useRef<SVGGElement>(null);
  const frRef = useRef<SVGGElement>(null);
  const blRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let x = -90;
    let t = 0;
    let state: "walk" | "sit" | "pounce" = "walk";
    let stateT = 0;
    let blinkT = 0;
    let frame: number;

    const pick = () => (Math.random() < 0.5 ? "sit" : "pounce");

    const loop = () => {
      t += 0.12;
      stateT += 0.016;
      const container = catRef.current?.parentElement;
      const maxW = container?.offsetWidth ?? 800;
      const cat = catRef.current;
      if (!cat) return;

      if (state === "walk") {
        x += 1.6;
        const bob = Math.abs(Math.sin(t * 2)) * 6;
        cat.style.top = `${40 - bob}px`;
        if (flRef.current) flRef.current.style.transform = `rotate(${Math.sin(t * 4) * 30}deg)`;
        if (brRef.current) brRef.current.style.transform = `rotate(${Math.sin(t * 4) * 30}deg)`;
        if (frRef.current) frRef.current.style.transform = `rotate(${Math.sin(t * 4 + Math.PI) * 30}deg)`;
        if (blRef.current) blRef.current.style.transform = `rotate(${Math.sin(t * 4 + Math.PI) * 30}deg)`;
        if (tailRef.current) tailRef.current.style.transform = `rotate(${Math.sin(t * 3) * 15}deg)`;
        if (headRef.current) headRef.current.style.transform = "";
        if (stateT > 2.5 + Math.random() * 2) {
          state = pick();
          stateT = 0;
        }
        if (x > maxW + 90) {
          x = -90;
          state = "walk";
        }
      } else if (state === "sit") {
        if (flRef.current) flRef.current.style.transform = "rotate(-15deg)";
        if (frRef.current) frRef.current.style.transform = "rotate(-15deg)";
        if (blRef.current) blRef.current.style.transform = "rotate(15deg)";
        if (brRef.current) brRef.current.style.transform = "rotate(15deg)";
        if (tailRef.current) tailRef.current.style.transform = `rotate(${Math.sin(t * 6) * 20}deg)`;
        if (headRef.current) headRef.current.style.transform = `rotate(${Math.sin(t * 1.2) * 10}deg)`;
        blinkT += 0.016;
        if (eyesRef.current) {
          eyesRef.current.style.transform = blinkT > 2.2 && blinkT < 2.35 ? "scaleY(0.1)" : "scaleY(1)";
          if (blinkT > 2.35) blinkT = 0;
        }
        if (stateT > 2.2) {
          state = Math.random() < 0.6 ? "pounce" : "walk";
          stateT = 0;
          if (headRef.current) headRef.current.style.transform = "";
        }
      } else if (state === "pounce") {
        const p = Math.min(stateT / 0.6, 1);
        const jump = Math.sin(p * Math.PI) * 30;
        cat.style.top = `${40 - jump}px`;
        if (flRef.current) flRef.current.style.transform = "rotate(-40deg)";
        if (frRef.current) frRef.current.style.transform = "rotate(-40deg)";
        if (blRef.current) blRef.current.style.transform = "rotate(40deg)";
        if (brRef.current) brRef.current.style.transform = "rotate(40deg)";
        if (tailRef.current) tailRef.current.style.transform = `rotate(${-p * 40}deg)`;
        if (p < 1) x += 3;
        if (stateT > 0.6) {
          state = "walk";
          stateT = 0;
        }
      }

      cat.style.left = `${x}px`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative h-[70px] w-full bg-[#FF7A45] mt-10 flex items-center overflow-hidden ">
      <div ref={catRef} className="absolute top-1/2 -translate-y-1/2" style={{ left: -90 }}>
        <svg width="150"  height="70" viewBox="0 0 90 70">
          <g ref={tailRef} style={{ transformOrigin: "14px 40px" }}>
            <path d="M14 40 Q0 30 6 16" stroke="#4A4E58" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
          <g ref={blRef} style={{ transformOrigin: "20px 50px" }}>
            <rect x="16" y="46" width="8" height="18" rx="3" fill="#4A4E58" />
          </g>
          <g ref={flRef} style={{ transformOrigin: "60px 50px" }}>
            <rect x="56" y="46" width="8" height="18" rx="3" fill="#4A4E58" />
          </g>
          <ellipse cx="42" cy="46" rx="30" ry="16" fill="#767B87" />
          <g ref={brRef} style={{ transformOrigin: "24px 50px" }}>
            <rect x="20" y="46" width="8" height="18" rx="3" fill="#2A2C31" />
          </g>
          <g ref={frRef} style={{ transformOrigin: "64px 50px" }}>
            <rect x="60" y="46" width="8" height="18" rx="3" fill="#2A2C31" />
          </g>
          <g ref={headRef} style={{ transformOrigin: "70px 30px" }}>
            <circle cx="70" cy="30" r="16" fill="#4A4E58" />
            <polygon points="60,20 64,8 70,18" fill="#4A4E58" />
            <polygon points="78,18 84,8 80,20" fill="#4A4E58" />
            <g ref={eyesRef} style={{ transformOrigin: "70px 30px" }}>
              <circle cx="65" cy="30" r="2.5" fill="#201F1D" />
              <circle cx="76" cy="29" r="2.5" fill="#201F1D" />
            </g>
            <path d="M68 36 Q71 39 74 36" stroke="#201F1D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}