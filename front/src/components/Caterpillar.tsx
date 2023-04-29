import "../styles/global.css";
import { ReactComponent as LogoFace } from "../Assets/LogoFace.svg";
import { ReactComponent as LogoLegs } from "../Assets/LogoLegs.svg";


interface CaterpillarProps {
    crawling: boolean;
  }

const Caterpillar = (props: CaterpillarProps) => {
    const {crawling} =props 
  return (
    <div className="caterpillar">
      <Ball logoHead={true} crawl={crawling}></Ball>
      <Ball crawl={crawling}></Ball>
      <Ball crawl={crawling}></Ball>
      <Ball crawl={crawling}></Ball>
      <Ball crawl={crawling}></Ball>
    </div>
  );
};

interface BallProps {
  logoHead?: boolean;
  crawl: boolean
}

const Ball = (props: BallProps) => {
  const {logoHead, crawl} = props
  const isHead = logoHead ? true : false;



  return (
    <div className={crawl ? "ball ballCrawl" : "ball"}>
      {isHead ? (
        <div>
          <LogoFace
            width={75}
            height={75}
            style={{ marginBottom: "10px", marginLeft: "-5px" }}
          />
        </div>
      ) : (
        <div>
          <LogoLegs
            width={75}
            height={75}
            style={{ marginBottom: "-45px", marginLeft: "0px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Caterpillar;
