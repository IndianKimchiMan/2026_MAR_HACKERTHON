import circleLogoImg from "../../assets/6c69254dc86f14c3c3ff8eb72f6bf02df9ce59ef.png";

interface HYPlanLogoProps {
  size?: number;
}

export function HYPlanLogo({ size = 120 }: HYPlanLogoProps) {
  return (
    <img
      src={circleLogoImg}
      alt="Hanyang University Logo"
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  );
}

export { circleLogoImg as hyPlanLogoSrc };
