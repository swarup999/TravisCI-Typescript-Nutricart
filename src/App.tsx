/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "normalize.css";
import { emptyObject, getProteins } from "./assets/miranda";
import { getSupportedCodeFixes } from "typescript";

// checks if the extension is installed for the first time
// chrome.storage.local.get('isFirstInstallation', (result) => {
//   if (result.isFirstInstallation) {
//     console.log('First installation');
//     chrome.storage.local.set({ isFirstInstallation: false });
//   } else {
//     console.log('Not first installation');
//   }
// });

function App() {
  const [needInfo, setNeedInfo] = useState(false);
  // useEffect(() => {
  //   chrome.storage.sync.get(['Name'], (result) => {
  //     if(!result.Name) {
  //       setNeedInfo(true);
  //     } else {
  //       setNeedInfo(false);
  //     }
  //   });
  // });

  return (
    <div className="extension-container">
      <Header></Header>
      <div className="non-header">
        {needInfo ? (
          <InfoForm />
        ) : (
          <>
            <div className="overviews">
              <h2>Heads Up!</h2>
              <Overview listFn={getProteins} type={"protein"}></Overview>
              <Overview listFn={getProteins} type={"protein"}></Overview>
              <Overview listFn={getProteins} type={"protein"}></Overview>
              <Overview listFn={getProteins} type={"protein"}></Overview>
            </div>
            <div className="calculations">
              <div className="calculation-header">
                <h2>Details</h2>
              </div>
              <Calculations listFn={getProteins} type={"Protein"}></Calculations>
              <Calculations listFn={getProteins} type={"Sodium"}></Calculations>
              <Calculations listFn={getProteins} type={"Calories"}></Calculations>
            </div>
          </>
        )}
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

function Overview({ listFn, type }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);
  const [data, setData] = useState<dataProp>(emptyObject);
  const BADTEXT = "Does not hit your protein goal per serving!";
  const MEDTEXT = "Almost at your protein goal per serving!";
  const GOODTEXT = "You hit your protein goal!";
  useEffect(() => {
    const fetchData = async () => {
      setData(await listFn());
    };
    fetchData().catch(console.error);
  }, [listFn, data]);

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }

  if (data.list.length === 0) return <></>;
  let severity;
  let text;
  if (Math.abs(data.expected - data.total) < data.expected * 0.05) {
    severity = "mint";
    text = GOODTEXT;
  } else if (Math.abs(data.expected - data.total) < data.expected * 0.15) {
    severity = "yellow";
    text = MEDTEXT;
  } else {
    severity = "red";
    text = BADTEXT;
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
          <h3>{text}</h3>
        </a>
        {isCollapsed ? (
          ""
        ) : (
          <>
            <p>
              You need {data.expected - data.total + "g"} more protein per meal to hit your goal of{" "}
              {data.expected + "g"}
            </p>
          </>
        )}
        <div className="colorline" style={{ backgroundColor: `var(--color-${severity})` }}></div>
      </div>
    </>
  );
}

type calcProp = {
  listFn: Function;
  type: any;
};

type dataProp = {
  list: any;
  total: any;
  type: any;
  expected: any;
};

function Calculations({ listFn, type }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);

  const [data, setData] = useState<dataProp>(emptyObject);

  useEffect(() => {
    const fetchData = async () => {
      setData(await listFn());
    };
    fetchData().catch(console.error);
  }, [listFn, data]);

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }

  let severity;
  if (data.total === undefined) {
    severity = "";
  } else {
    if (Math.abs(data.expected - data.total) < data.expected * 0.05) {
      severity = "mint";
    } else if (Math.abs(data.expected - data.total) < data.expected * 0.15) {
      severity = "yellow";
    } else {
      severity = "red";
    }
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
            <h2>{type}</h2>
          </a>
          {isCollapsed ? (
            <h2 className="detail-number">{data.total === undefined ? " " : data.total + "g / " + data.expected + 'g'}</h2>
          ) : (
            ""
          )}
        </div>

        {isCollapsed ? (
          ""
        ) : (
          <>
            {data.list.length !== 0
              ? data.list.map((element: any, index: any) => (
                  <div className="detail-element" key={index}>
                    <div className="item-name-icon">
                      <img src={element.src} />
                      <div className="item-name">
                        <h3>{element.name}</h3>
                        <h4>{element.weight}</h4>
                      </div>
                    </div>
                    <h2>{element.total}g</h2>
                  </div>
                ))
              : "Loading..."}
            {data.total === undefined ? (
              ""
            ) : (
              <>
                <div className="divider"></div>
                <div className="detail-total">
                  <h2>{data.total}g</h2>
                  <h3>total per serving</h3>
                </div>
              </>
            )}
          </>
        )}
        <div className="colorline" style={{ backgroundColor: `var(--color-${severity})` }}></div>
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
    get(keys: string | string[] | null, callback: (result: { [key: string]: any }) => void): void;

    set(items: { [key: string]: any }, callback?: () => void): void;
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

  const requiredInfo = ["Name", "Gender", "Weight", "Height", "Age"];

  const advancedInfo = ["Calories", "Protein", "Carbs", "Fat", "Fibre", "Sodium"];

  interface FormData {
    [key: string]: string;
  }

  const [formData, setFormData] = useState<FormData>({});

  return (
    <form
      onSubmit={(e) => {
        Object.keys(formData).forEach((key: any) => {
          chrome.storage.sync.set({ [key]: formData[key] }, function () {
            console.log(`${key} has been set to ${formData[key]}`);
          });
        });
      }}
    >
      {requiredInfo.map((item: string) => {
        return (
          <div key={item}>
            <label>{item}</label>
            <input
              id={item}
              type="text"
              required={true}
              onChange={(event) => {
                let newFormData = { ...formData };
                newFormData[item] = event.target.value;
                setFormData(newFormData);
                console.log(formData);
              }}
            />
          </div>
        );
      })}
      {advancedInfo.map((item: string) => {
        return (
          <div key={item}>
            <label>{item}</label>
            <input
              id={item}
              type="text"
              required={false}
              onChange={(event) => {
                let newFormData = { ...formData };
                newFormData[item] = event.target.value;
                setFormData(newFormData);
              }}
            />
          </div>
        );
      })}
      <button type="submit">OK</button>
    </form>
  );
}

export default App;
