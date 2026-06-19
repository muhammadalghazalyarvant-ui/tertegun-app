import React from "react";

interface MenuButton {
  id: string;
  label: string;
  type: "button" | "submit" | "reset";
}

const menuButtons: MenuButton[] = [
  { id: "start", label: "START", type: "button" },
  { id: "quit", label: "QUIT", type: "button" },
];

// Menambahkan properti 'onStart' agar komponen ini bisa mengirim perintah ke App.tsx
export const StartMenu = ({
  onStart,
}: {
  onStart: () => void;
}): JSX.Element => {
  const handleAction = (action: string) => {
    if (action === "start") {
      onStart(); // Pemicu perpindahan halaman ke MainMenu
    }

    if (action === "quit") {
      if (typeof window !== "undefined") {
        window.close();
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-[#e8c9de]">
      <section
        className="flex h-[1024px] w-full max-w-[1440px] flex-col items-center gap-[47px] px-[419px] py-[295px] relative bg-[#e8c9de]"
        aria-label="Start menu"
      >
        <header className="relative w-[606px] h-[170px] mr-[-4.00px]">
          <h1 className="absolute -top-px left-[calc(50.00%_-_241px)] w-[539px] [-webkit-text-stroke:1px_#000000] [font-family:'Braah_One-Regular',Helvetica] font-normal text-colors-accents-mint text-[120px] text-center tracking-[-2.40px] leading-[normal] whitespace-nowrap">
            Tertegun
          </h1>
          <p className="absolute top-[129px] left-0 w-[310px] [font-family:'Braah_One-Regular',Helvetica] font-normal text-black text-xl text-center tracking-[-0.40px] leading-[normal]">
            By: Arvant
          </p>
        </header>

        <nav
          className="flex flex-col items-center gap-[34px]"
          aria-label="Primary actions"
        >
          {menuButtons.map((button) => (
            <button
              key={button.id}
              type={button.type}
              onClick={() => handleAction(button.id)}
              aria-label={button.label}
              className="flex w-[184px] items-center justify-center gap-2.5 p-2.5 rounded-[30px] border border-solid border-black cursor-pointer transition-all duration-200 
                         bg-transparent      /* Stage 1: Polos */
                         hover:bg-[#ff7e7e]  /* Stage 2: Merah Muda (Hover) */
                         active:bg-[#ff0f0f] /* Stage 3: Merah Pekat (Klik) */"
            >
              <span className="[font-family:'Bungee-Regular',Helvetica] font-normal text-black text-[50px] text-center tracking-[-1.00px] leading-[normal] whitespace-nowrap">
                {button.label}
              </span>
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
};

export default StartMenu;
