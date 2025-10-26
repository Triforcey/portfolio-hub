import { HeaderImage } from "@super-portfolio/portfolio-component-lib";
import { HighResImage } from './components/HighResImage';
import { HighResImageServerProvider } from './components/HighResImage/HighResImageServerProvider';

const headerBgPath = './app/header-bg.png';

export default function Home() {
  return (
    <HighResImageServerProvider imagePath={headerBgPath}>
      <HeaderImage
        asset="header-bg.png"
        ImageOverride={HighResImage}
        width={3440}
        height={2880}
        lowQuality={95}
        highQuality={100}
      />
    </HighResImageServerProvider>
  );
}
