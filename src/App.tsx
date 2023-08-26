import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "normalize.css";
import { getProteins, getProteinTotal } from "./assets/miranda";

// checks if the extension is installed for the first time
chrome.storage.sync.get('isFirstInstallation', (result) => {
  if (result.isFirstInstallation) {
    console.log('First installation');
    chrome.storage.sync.set({ isFirstInstallation: false });
  } else {
    console.log('Not first installation');
  }
});

function App() {
  return (
    <div className="extension-container">
      <Header></Header>
      <div className="non-header">
        <div className="overviews">
          <h2>Heads Up!</h2>
          <Overview></Overview>
          <Overview></Overview>
          <Overview></Overview>
        </div>
        <div className="calculations">
          <div className="calculation-header">
            <h2>Details</h2>
          </div>
          <Calculations totalFn={getProteinTotal} listFn={getProteins}></Calculations>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}

function Header() {
  return (
    <>
      <div className="header">
        <div className="header-text">
          <div className="logo">
            {/* <img src="https://placehold.co/300x60" /> */}
            <h1>nutricart</h1>
          </div>
          <div className="subheader">
            <h3>Welcome back, Victor!</h3>
          </div>
        </div>

        <div className="settings">
          <img src="https://placehold.co/60" alt="" />
        </div>
      </div>
    </>
  );
}

function Overview() {
  const [isCollapsed, setCollapsed] = useState(false);

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }

  return (
    <>
      <div className="overview-container">
        <a
          onClick={() => {
            toggleCollapse();
          }}
          className="overview-tab"
        >
          <h3>Does not hit your protein goal per serving!</h3>
        </a>
        {isCollapsed ? (
          ""
        ) : (
          <>
            <p>You need 33g more protein per meal to hit your goal of 150g!</p>
          </>
        )}
        <div className="colorline" style={{ backgroundColor: "var(--color-red)" }}></div>
      </div>
    </>
  );
}

type calcProp = {
  listFn: Function;
  totalFn: Function;
};

function Calculations({ listFn, totalFn } : calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(await listFn())
    };
  
    fetchData()
      // make sure to catch any error
      .catch(console.error);;
  }, [listFn])

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }
  return (
    <>
      <div className="detail-container">
        <div style={{ position: "relative" }}>
          <a
            onClick={() => {
              toggleCollapse();
            }}
            className="detail-tab"
          >
            <h2>Protein</h2>
          </a>
          {isCollapsed ? <h2 className="detail-number">117g</h2> : ""}
        </div>

        {isCollapsed ? (
          ""
        ) : (
          <>
            <div className="detail-element">
              <div className="item-name-icon">
                <img src="https://placehold.co/85" />
                <div className="item-name">
                  <h3>Free From Chicken Thigh, Boneless, Skinless, Club Pack</h3>
                  <h4>3.8kg</h4>
                </div>
              </div>
              <h2>54g</h2>
            </div>
            <div className="detail-element">
              <div className="item-name-icon">
                <img src="https://placehold.co/85" />
                <div className="item-name">
                  <h3>PC Chicken Thighs</h3>
                  <h4>3.8kg</h4>
                </div>
              </div>
              <h2>54g</h2>
            </div>
            <div className="detail-element">
              <div className="item-name-icon">
                <img src="https://placehold.co/85" />
                <div className="item-name">
                  <h3>PC Chicken Thighs</h3>
                  <h4>3.8kg</h4>
                </div>
              </div>
              <h2>54g</h2>
            </div>
            <div className="divider"></div>
            <div className="detail-total">
              <h2>99g</h2>
              <h3>total per serving</h3>
            </div>
          </>
        )}
        <div className="colorline" style={{ backgroundColor: "var(--color-red)" }}></div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <div className="footer">
      <h4>© 2023 NutriTechnics</h4>
    </div>
  );
}
export default App;
