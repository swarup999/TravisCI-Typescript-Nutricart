import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "normalize.css";
import { emptyObject, getProteins } from "./assets/miranda";
import { getSupportedCodeFixes } from "typescript";
//import onPopupOpen from "./webscrap";
//import { on } from "events";

type foodItem = {
  name: string;
  weight: number;
  src: string;
  total: number;
}

type macroData = {
  type: string;
  total: number;
  expected: number;
  list: Array<foodItem>;
};

function App() {
  //onPopupOpen();
  const [name, setName] = useState("");
  useEffect(() => {
    chrome.storage.sync.get(['Name'], (result) => {
      setName(result.Name);
    });
  });
  const updateName = () => {
    setName("");
  };

  const [proteinData, SetProteinData] = useState<macroData>({
    type: "protein",
    total: 0,
    expected: 100,
    list: [],
  });

  const [fatData, SetFatData] = useState<macroData>({
    type: "fat",
    total: 0,
    expected: 100,
    list: [],
  });

  useEffect(() => {
    const key = setInterval(() => {
      if(globalCart.protein) {
        console.log(globalCart.protein);
        clearInterval(key);
        let newProteinData = {...proteinData};
        let newFatData = {...fatData};
        // @ts-ignore: Unreachable code error
        globalItems.forEach((item: any) => {
        newProteinData.list = [...newProteinData.list, 
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.quantity
          }
        ];
        newFatData.list = [...newFatData.list,
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.quantity
          }
        ];
      });
      newProteinData.total += globalCart.protein;
      console.log(newProteinData);
      SetProteinData(newProteinData);
      console.log(proteinData);

      newFatData.total += globalCart.fat;
      console.log(newFatData);
      SetFatData(newFatData);
      console.log(fatData);
    }
    }, 1000);
    return () => {
      clearInterval(key);
    }
  }, []);
  


  // useEffect(() => {
  //   console.log('in globalCart use effect');
  //   // @ts-ignore: Unreachable code error
  //   console.log(JSON.stringify(window.globalCart));
  //   // @ts-ignore: Unreachable code error
  //   console.log(window.globalCart.protein);
  //   let newProteinData = {...proteinData};
  //   // @ts-ignore: Unreachable code error
  //   newProteinData.total += window.globalCart.protein;
  //   SetProteinData(newProteinData);
  //   console.log(proteinData);
  //   console.log(newProteinData);
  //   // @ts-ignore: Unreachable code error
  // }, [window.globalCart]);

  // useEffect(() => {
  //   console.log('in globalItems use effect');
  //   let newProteinData = {...proteinData};
  //   // @ts-ignore: Unreachable code error
  //   globalItems.forEach((item: any) => {
  //     newProteinData.list = [...newProteinData.list, 
  //       {
  //         name: item.name,
  //         src: item.src,
  //         weight: item.weight,
  //         total: item.quantity
  //       }
  //     ];
  //   });
  //   SetProteinData(newProteinData);
  //   // @ts-ignore: Unreachable code error
  // }, [globalItems]);

  return (
    <div className="extension-container">
      <Header name={name} updateName={updateName}></Header>
      <div className="non-header">
        {
          !name ? <InfoForm /> :
          <>
            <div className="overviews">
              <h2>Heads Up!</h2>
              <Overview listFn={getProteins} type={"protein"} realData={proteinData}></Overview>
              {/* <Overview listFn={getProteins} type={"protein"}></Overview>
              <Overview listFn={getProteins} type={"protein"}></Overview>
              <Overview listFn={getProteins} type={"protein"}></Overview> */}
            </div>
            <div className="calculations">
              <div className="calculation-header">
                <h2>Details</h2>
              </div>
              {/* <Calculations listFn={getProteins} type={"Protein"}></Calculations>
              <Calculations listFn={getProteins} type={"Sodium"}></Calculations>
              <Calculations listFn={getProteins} type={"Calories"}></Calculations> */}
            </div>
          </>
        }
        <Footer></Footer>
      </div>
    </div>
  );
}

function Header(props: any) {

  return (
    <>
      <div className="header">
        <div className="header-text">
          <div className="logo">
            {/* <img src="https://placehold.co/300x60" /> */}
            <h1>nutricart</h1>
          </div>
          {props.name &&
          <div className="subheader">
            <h3>{`Welcome back, ${props.name}!`}</h3>
          </div> 
          }
        </div>

        <div className="settings">
          <a title="Reset User Info" onClick={() => {
            chrome.storage.sync.set({ ['Name']: ""});
            props.updateName();
          }}><img src="https://placehold.co/60" alt="" /></a>
        </div>
      </div>
    </>
  );
}

function Overview({ listFn, type, realData }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);
  // const [data, setData] = useState<dataProp>(emptyObject);
  const BADTEXT = "Does not hit your protein goal per serving!";
  const MEDTEXT = "Almost at your protein goal per serving!";
  const GOODTEXT = "You hit your protein goal!";
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setData(await listFn());
  //   };
  //   fetchData().catch(console.error);
  // }, [listFn, data]);

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }

  const data = realData;
  console.log(`real data is `);
  console.log(data);


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
  realData: any;
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
                        <h4>{element.weight}kg</h4>
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

  chrome.storage.sync.set({name: "x"}, function() {
    console.log("Data saved");
  });

  useEffect(() => {
    chrome.storage.sync.get(['name'], (result) => {
      console.log(result);
    });
  }, []);

  const requiredInfo = ["Name", "Gender", "Weight", "Height", "Age", "Days"];

  const advancedInfo = ["Calories", "Protein", "Carbs", "Fat", "Fibre", "Sodium"];

  interface FormData {
    [key: string]: string;
  }

  const [formData, setFormData] = useState<FormData>({});

  return (
    <form onSubmit={(e) => {
      Object.keys(formData).forEach((key: any) => {
        chrome.storage.sync.set({ [key]: formData[key]});
      });
    }}>
      <div key="Name">
        <label>Name:</label>
        <input type="text" required={true} onChange={(e) => {
          let newFormData = {...formData};
          newFormData["Name"] = e.target.value;
          setFormData(newFormData);
        }}></input>
      </div>
      <div key="Gender">
        <label>Gender:</label>
        <select onChange={(e) => {
          let newFormData = {...formData};
          newFormData["Gender"] = e.target.value;
          setFormData(newFormData);
        }}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
      </div>
      <div key="Weight">
        <label>Weight (kg):</label>
        <input type="number" required={true} min={1} max={300} onChange={(e) => {
          let newFormData = {...formData};
          newFormData["Weight"] = e.target.value;
          setFormData(newFormData);
        }}></input>
      </div>
      <div key="Height">
        <label>Height (cm):</label>
        <input type="number" required={true} min={1} max={300} onChange={(e) => {
          let newFormData = {...formData};
          newFormData["Height"] = e.target.value;
          setFormData(newFormData);
        }}></input>
      </div>
      <div key="Age">
        <label>Age:</label>
        <input type="number" required={true} min={1} max={200} onChange={(e) => {
          let newFormData = {...formData};
          newFormData["Age"] = e.target.value;
          setFormData(newFormData);
        }}></input>
      </div>
      {advancedInfo.map((item: string) => {
        return (
          <div key={item}>
            <label>{`Target ${item} (Optional):`}</label>
            <input id={item} type="number" required={false} min={1} max={10000} onChange={(event) => {
              let newFormData = {...formData};
              newFormData[item] = event.target.value;
              setFormData(newFormData);
            }}/>
          </div>
        );
      })}
      <div key="Frequency">
        <label>I shop once every </label>
        <input type="number" required={true} min={1} max={1000} onChange={(e) => {
          let newFormData = {...formData};
          newFormData["Days"] = e.target.value;
          setFormData(newFormData);
        }}></input>
        <label> days.</label>
      </div>
      <button type="submit">OK</button>
    </form>
  );
}

export default App;
