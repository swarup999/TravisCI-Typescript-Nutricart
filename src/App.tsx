// import { useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import "normalize.css";

function App() {
  const [needInfo, setNeedInfo] = useState(false);
  useEffect(() => {
    chrome.storage.sync.get(['Name'], (result) => {
      if(!result.Name) {
        setNeedInfo(true);
      } else {
        setNeedInfo(false);
      }
    });
  });

  return (
    <div className="extension-container">
      <Header></Header>
      <div className="non-header">
        {
          needInfo ? <InfoForm /> :
          <>
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
            <Calculations></Calculations>
            <Calculations></Calculations>
            <Calculations></Calculations>
          </div>
          </>
        }
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
          <img src="https://placehold.co/60" />
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

function Calculations() {
  const [isCollapsed, setCollapsed] = useState(false);

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }
  return (
    <>
      <div className="detail-container">
        <a
          onClick={() => {
            toggleCollapse();
          }}
          className="detail-tab"
        >
          <h2>Protein</h2>
        {isCollapsed ? (
          <h2>117g</h2>
        ) : (
          ""
        )}
        </a>
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

declare namespace chrome.storage {
  interface StorageArea {
    get(
      keys: string | string[] | null,
      callback: (result: { [key: string]: any }) => void
    ): void;

    set(
      items: { [key: string]: any },
      callback?: () => void
    ): void;
  }

  const sync: StorageArea;
}

function InfoForm() {
  // chrome.storage.sync.set({name: "x"}, function() {
  //   console.log("Data saved");
  // });

  // useEffect(() => {
  //   chrome.storage.sync.get(['name'], (result) => {
  //     console.log(result);
  //   });
  // }, []);

  const requiredInfo = [
    'Name',
    'Gender',
    'Weight',
    'Height',
    'Age',
  ];

  const advancedInfo = [
    'Calories',
    'Protein',
    'Carbs',
    'Fat',
    'Fibre',
    'Sodium',
  ];

  interface FormData {
    [key: string]: string; 
  }

  const [formData, setFormData ] = useState<FormData>({});

  return (
    <form onSubmit={(e) => {
      Object.keys(formData).forEach((key: any) => {
        chrome.storage.sync.set({ [key]: formData[key]}, function() {
          console.log(`${key} has been set to ${formData[key]}`);
        });
      });
    }}>
      {requiredInfo.map((item: string) => {
        return (
          <div key={item}>
            <label>{item}</label>
            <input id={item} type="text" required={true} onChange={(event) => {
              let newFormData = {...formData};
              newFormData[item] = event.target.value;
              setFormData(newFormData);
              console.log(formData);
            }}/>
          </div>
        );
      })}
      {advancedInfo.map((item: string) => {
        return (
          <div key={item}>
            <label>{item}</label>
            <input id={item} type="text" required={false} onChange={(event) => {
              let newFormData = {...formData};
              newFormData[item] = event.target.value;
              setFormData(newFormData);
              console.log(formData);
            }}/>
          </div>
        );
      })}
      <button type="submit">OK</button>
    </form>
  );
}

export default App;
