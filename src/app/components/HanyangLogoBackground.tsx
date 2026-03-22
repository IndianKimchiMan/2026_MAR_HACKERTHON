import hyuLogoImg from "../../assets/4b221ea437fd2639fa6f940a22e285c7b284c6f6.png";

export function HanyangLogoBackground() {
  return (
    <div className="absolute bottom-0 right-0 w-[900px] h-[600px] pointer-events-none">
      <img 
        src={hyuLogoImg} 
        alt="HYU Logo Background" 
        className="absolute bottom-20 right-10 w-full h-auto opacity-5"
      />
    </div>
  );
}