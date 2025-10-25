import { HeaderImage } from "@super-portfolio/portfolio-component-lib";
import headerBg from './header-bg.png';
import Image from 'next/image';
export default function Home() {
  return (
    <>
      <HeaderImage
        imageSrc={headerBg.src}
        ImageOverride={Image}
        width={3440}
        height={4880}
        alt="Header background"
      />
    </>
  );
}
