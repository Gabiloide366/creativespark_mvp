import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const [time, setTime] = useState("12:52");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timerId = setInterval(updateClock, 30000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-0 md:p-8 bg-[#111827] overflow-hidden z-10 w-full">
      {/* Outer ambient decorative background blob glow context */}
      <div className="absolute inset-0 z-0 bg-radial-[circle_at_center,rgba(63,99,117,0.15),transparent_70%]" />

      {/* Floating browser layout controller widget explanation on the side (Desktop only) */}
      <div className="hidden lg:flex absolute left-8 top-12 flex-col max-w-[240px] gap-3 bg-[#1e293b]/90 border border-[#334155] p-4 rounded-xl shadow-xl text-xs text-gray-300">
        <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
          <span>✨</span> Interactive Prototype
        </h3>
        <p className="leading-relaxed">
          This app is emulated inside a high-fidelity <strong>9:16 vertical mobile view frame</strong> to perfectly mirror the native mobile experience.
        </p>
        <div className="border-t border-[#334155] pt-2 mt-1 space-y-1.5">
          <p className="font-medium text-[#7da1b5]">Navigation Tips:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Navigate between cards or views using bottom tabs.</li>
            <li>On <strong>Home</strong>, tap "Participate" to go to the upload creator form.</li>
            <li>In the <strong>Gallery</strong>, click on any artwork cards to reveal details and likes.</li>
            <li>In the <strong>Profile</strong>, click <strong>Claim</strong> after 1 week to claim ownership on anonymous posts!</li>
          </ul>
        </div>
      </div>

      {/* Actual phone chassis containment */}
      <div 
        id="phone-wrapper"
        className="w-full max-w-full md:w-[390px] h-screen md:h-[844px] bg-[#faf9f8] text-[#1a1c1c] md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-0 md:border-[10px] border-[#22252a] flex flex-col relative overflow-hidden transition-all duration-300 z-10 select-none"
      >
        {/* Dynamic Notch & Screen Status bar - Mobile/Desktop layout */}
        <div className="absolute top-0 inset-x-0 h-11 bg-[#faf9f8]/95 backdrop-blur-md flex items-center justify-between px-6 z-50 text-[#1a1c1c] pointer-events-none select-none">
          {/* Mock Time */}
          <span className="text-[13px] font-bold tracking-tight">{time}</span>

          {/* Notch Pillow (Apple/Android typical device style) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-[110px] h-[25px] bg-[#22252a] rounded-b-[18px]" />

          {/* System Status Indicators */}
          <div className="flex items-center gap-1.5 text-[#1a1c1c]">
            <Signal className="w-4 h-4" strokeWidth={2.5} />
            <Wifi className="w-4 h-4" strokeWidth={2.5} />
            <div className="flex items-center gap-0.5">
              <span className="text-[11px] font-bold">94%</span>
              <Battery className="w-4 h-4 rotate-0" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Screen layout content injection */}
        <div className="flex-1 flex flex-col pt-11 overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
}
