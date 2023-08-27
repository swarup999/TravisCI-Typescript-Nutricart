import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "normalize.css";
import logo from "./assets/logo-wide.svg";
import { emptyObject, getProteins } from "./assets/miranda";
import { getSupportedCodeFixes } from "typescript";
//import onPopupOpen from "./webscrap";
//import { on } from "events";

type foodItem = {
  name: string;
  weight: number;
  src: string;
  total: number;
};

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
    chrome.storage.sync.get(["Name"], (result) => {
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

  const [carbsData, SetCarbsData] = useState<macroData>({
    type: "carbs",
    total: 0,
    expected: 100,
    list: [],
  });

  const [fibreData, SetFibreData] = useState<macroData>({
    type: "fibre",
    total: 0,
    expected: 100,
    list: [],
  });

  const [caloriesData, SetCaloriesData] = useState<macroData>({
    type: "calories",
    total: 0,
    expected: 100,
    list: [],
  });

  useEffect(() => {
    const key = setInterval(() => {
      if (globalCart.protein) {
        clearInterval(key);
        let newProteinData = { ...proteinData };
        let newFatData = { ...fatData };
        let newFibreData = { ...fibreData };
        let newCaloriesData = { ...caloriesData };
        let newCarbsData = { ...carbsData };

        // @ts-ignore: Unreachable code error
        globalItems.forEach((item: any) => {
          newProteinData.list = [
            ...newProteinData.list,
            {
              name: item.name,
              src: item.src,
              weight: item.weight,
              total: item.quantity,
            },
          ];
          newFatData.list = [
            ...newFatData.list,
            {
              name: item.name,
              src: item.src,
              weight: item.weight,
              total: item.quantity,
            },
          ];
          newCarbsData.list = [
            ...newCarbsData.list,
            {
              name: item.name,
              src: item.src,
              weight: item.weight,
              total: item.quantity,
            },
          ];
          newFibreData.list = [
            ...newFibreData.list,
            {
              name: item.name,
              src: item.src,
              weight: item.weight,
              total: item.quantity,
            },
          ];
          newCaloriesData.list = [
            ...newCaloriesData.list,
            {
              name: item.name,
              src: item.src,
              weight: item.weight,
              total: item.quantity,
            },
          ];
        });
        newProteinData.total += globalCart.protein;
        SetProteinData(newProteinData);
        newFatData.total += globalCart.fat;
        SetFatData(newFatData);
        newFibreData.total += globalCart.fibre;
        SetFibreData(newFibreData);
        newCarbsData.total += globalCart.carbs;
        SetCarbsData(newCarbsData);
        newCaloriesData.total += globalCart.calories;
        SetCaloriesData(newCaloriesData);
      }
    }, 1000);
    return () => {
      clearInterval(key);
    };
  }, []);

  return (
    <div className="extension-container">
      <Header name={name} updateName={updateName}></Header>
      <div className="non-header">
        {!name ? (
          <InfoForm />
        ) : (
          <>
            <div className="overviews">
              <h2>Heads Up!</h2>
              <Overview listFn={getProteins} type={"calories"} realData={caloriesData}></Overview>
              <Overview listFn={getProteins} type={"protein"} realData={proteinData}></Overview>
              <Overview listFn={getProteins} type={"carbs"} realData={carbsData}></Overview>
              <Overview listFn={getProteins} type={"fat"} realData={fatData}></Overview>
              <Overview listFn={getProteins} type={"fibre"} realData={fibreData}></Overview>
            </div>
            <div className="calculations">
              <div className="calculation-header">
                <h2>Details</h2>
              </div>
              <Calculations
                listFn={getProteins}
                type={"Calories"}
                realData={caloriesData}
              ></Calculations>
              <Calculations
                listFn={getProteins}
                type={"Protein"}
                realData={proteinData}
              ></Calculations>
              <Calculations listFn={getProteins} type={"Carbs"} realData={carbsData}></Calculations>
              <Calculations listFn={getProteins} type={"Fat"} realData={fatData}></Calculations>
              <Calculations listFn={getProteins} type={"Fibre"} realData={fibreData}></Calculations>
            </div>
          </>
        )}
        <Footer></Footer>
      </div>
    </div>
  );
}

function Header(props: any) {
  // @ts-ignore: Unreachable code error
  useEffect(
    () => {
      console.log("global shit updated to " + ("globalVar" in window ? window.globalVar : "?"));
    },
    // @ts-ignore: Unreachable code error
    [globalVar]
  );
  return (
    <>
      <div className="header">
        <div className="header-text">
          <div className="logo">
            <img style={{ margin: "10px 0px", width: "150px" }} src={logo} />
            {/* <h1>nutricart</h1> */}
          </div>
          {props.name && (
            <div className="subheader">
              <h3>{`Welcome back, ${props.name}!`}</h3>
            </div>
          )}
        </div>

        <div className="settings">
          <a
            title="Reset User Info"
            onClick={() => {
              chrome.storage.sync.set({ ["Name"]: "" });
              props.updateName();
            }}
          >
            <img src="https://placehold.co/60" alt="" />
          </a>
        </div>
      </div>
    </>
  );
}

function Overview({ listFn, type, realData }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);
  const data = realData;
  console.log(`real data is `);
  console.log(data);
  const BADTEXT = `Does not hit your ${type} goal per serving!`;
  const MEDTEXT = `Almost at your ${type} goal per serving!`;
  const GOODTEXT = `You hit your ${type} goal!`;
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setData(await listFn());
  //   };
  //   fetchData().catch(console.error);
  // }, [listFn, data]);

  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }

  if (data.list.length === 0) return <></>;
  let severity = "";
  let text = "";
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
              {severity === "mint"
                ? ""
                : `
                You need ${
                  Math.abs(data.expected - data.total) + (type === "calories" ? "" : "g")
                } ${
                    data.expected > data.total ? "more" : "less"
                  } ${type} per meal to hit your goal of ${
                    data.expected + (type === "calories" ? "" : "g")
                  }`}
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

function Calculations({ listFn, type, realData }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);

  // const [data, setData] = useState<dataProp>(emptyObject);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setData(await listFn());
  //   };
  //   fetchData().catch(console.error);
  // }, [listFn, data]);

  const data = realData;

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
      console.log(data.total);
      console.log(data.expected);
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
            <h2 className="detail-number">
              {data.total === undefined ? " " : data.total + "g / " + data.expected + "g"}
            </h2>
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
                      <div className="img-container">
                        <img src={element.src} />
                      </div>
                      <div className="item-name">
                        <h3>{element.name}</h3>
                        <h4>{element.weight}</h4>
                      </div>
                    </div>
                    <h2>{element.total}{type === "Calories" ?"": "g"}</h2>
                  </div>
                ))
              : "Loading..."}
            {data.total === undefined ? (
              ""
            ) : (
              <>
                <div className="divider"></div>
                <div className="detail-total">
                  <h2>{data.total}{type === "Calories" ?"": "g"}</h2>
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
function InfoFormCSSTEST() {
  const requiredInfo = ["Name", "Gender", "Weight", "Height", "Age", "Days"];

  const advancedInfo = ["Calories", "Protein", "Carbs", "Fat", "Fibre", "Sodium"];

  interface FormData {
    [key: string]: string;
  }

  const [formData, setFormData] = useState<FormData>({});
  const [stage, setStage] = useState<any>(0);
  console.log(formData);
  return (
    <>
      <form className="form-container">
        {stage === 0 ? (
          <>
            <h2 style={{ textAlign: "center" }}>Let's get to know you a bit more.</h2>
            <div id="name-container" key="Name">
              <label>How should we address you?</label>
              <input
                id="name-input"
                type="text"
                placeholder={"Name"}
                required={true}
                onChange={(e) => {
                  let newFormData = { ...formData };
                  newFormData["Name"] = e.target.value;
                  setFormData(newFormData);
                }}
              ></input>
            </div>
          </>
        ) : (
          ""
        )}
        {stage === 1 ? (
          <>
            <h2 style={{ textAlign: "center" }}>Just a little more...</h2>
            <div className="form-element-1">
              <div className="gender-container" key="Gender">
                <label>Gender:</label>
                <select
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Gender"] = e.target.value;
                    setFormData(newFormData);
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div key="Weight">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  required={true}
                  min={1}
                  max={300}
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Weight"] = e.target.value;
                    setFormData(newFormData);
                  }}
                ></input>
              </div>
              <div key="Height">
                <label>Height (cm):</label>
                <input
                  type="number"
                  required={true}
                  min={1}
                  max={300}
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Height"] = e.target.value;
                    setFormData(newFormData);
                  }}
                ></input>
              </div>
              <div key="Age">
                <label>Age:</label>
                <input
                  type="number"
                  required={true}
                  min={1}
                  max={200}
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Age"] = e.target.value;
                    setFormData(newFormData);
                  }}
                ></input>
              </div>
            </div>
          </>
        ) : (
          " "
        )}
        {stage === 2 ? (
          <>
            <h2 style={{ textAlign: "center" }}>You can leave these blank if you'd like.</h2>
            <div className="form-element-2">
              {advancedInfo.map((item: string) => {
                return (
                  <div key={item}>
                    <label>{`Target ${item} (Optional):`}</label>
                    <input
                      id={item}
                      type="number"
                      required={false}
                      min={1}
                      max={10000}
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
            </div>
          </>
        ) : (
          ""
        )}
        {stage === 3 ? (
          <>
            <h2 style={{ textAlign: "center" }}>One more question...</h2>
            <div className="form-element-3" key="Frequency">
              <label>I shop once every </label>
              <input
                type="number"
                required={true}
                min={1}
                max={1000}
                onChange={(e) => {
                  let newFormData = { ...formData };
                  newFormData["Days"] = e.target.value;
                  setFormData(newFormData);
                }}
              ></input>
              <label> days.</label>
            </div>
            <button className="init-button" type="submit">
              Submit
            </button>
          </>
        ) : (
          " "
        )}
      </form>
      {stage !== 3 ? (
        <button
          onClick={() => document.querySelector("form")?.reportValidity() && setStage(stage + 1)}
          className="init-button"
        >
          Next
        </button>
      ) : (
        ""
      )}
    </>
  );
}

function InfoForm() {
  chrome.storage.sync.set({ name: "x" }, function () {
    console.log("Data saved");
  });

  useEffect(() => {
    chrome.storage.sync.get(["name"], (result) => {
      console.log(result);
    });
  }, []);

  const requiredInfo = ["Name", "Gender", "Weight", "Height", "Age", "Days"];

  const advancedInfo = ["Calories", "Protein", "Carbs", "Fat", "Fibre", "Sodium"];

  interface FormData {
    [key: string]: string;
  }

  const [formData, setFormData] = useState<FormData>({});
  const [stage, setStage] = useState<any>(0);

  return (
    <>
      <form
        onSubmit={(e) => {
          Object.keys(formData).forEach((key: any) => {
            chrome.storage.sync.set({ [key]: formData[key] });
          });
        }}
      >
        {stage === 0 ? (
          <>
            <h2 style={{ textAlign: "center" }}>Let's get to know you a bit more.</h2>
            <div id="name-container" key="Name">
              <label>How should we address you?</label>
              <input
                id="name-input"
                type="text"
                placeholder="Your name"
                required={true}
                onChange={(e) => {
                  let newFormData = { ...formData };
                  newFormData["Name"] = e.target.value;
                  setFormData(newFormData);
                }}
              ></input>
            </div>
          </>
        ) : (
          ""
        )}
        {stage === 1 ? (
          <>
            <h2 style={{ textAlign: "center" }}>Just a little more...</h2>
            <div className="form-element-1">
              <div className="gender-container" key="Gender">
                <label>Gender:</label>
                <select
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Gender"] = e.target.value;
                    setFormData(newFormData);
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div key="Weight">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  required={true}
                  min={1}
                  max={300}
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Weight"] = e.target.value;
                    setFormData(newFormData);
                  }}
                ></input>
              </div>
              <div key="Height">
                <label>Height (cm):</label>
                <input
                  type="number"
                  required={true}
                  min={1}
                  max={300}
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Height"] = e.target.value;
                    setFormData(newFormData);
                  }}
                ></input>
              </div>
              <div key="Age">
                <label>Age:</label>
                <input
                  type="number"
                  required={true}
                  min={1}
                  max={200}
                  onChange={(e) => {
                    let newFormData = { ...formData };
                    newFormData["Age"] = e.target.value;
                    setFormData(newFormData);
                  }}
                ></input>
              </div>
            </div>
          </>
        ) : (
          " "
        )}
        {stage === 2 ? (
          <>
            <h2 style={{ textAlign: "center" }}>You can leave these blank if you'd like.</h2>
            <div className="form-element-2">
              {advancedInfo.map((item: string) => {
                return (
                  <div key={item}>
                    <label>{`Target ${item} (Optional):`}</label>
                    <input
                      id={item}
                      type="number"
                      required={false}
                      min={1}
                      max={10000}
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
            </div>
          </>
        ) : (
          ""
        )}
        {stage === 3 ? (
          <>
            <h2 style={{ textAlign: "center" }}>One more question...</h2>
            <div className="form-element-3" key="Frequency">
              <label>I shop once every </label>
              <input
                type="number"
                required={true}
                min={1}
                max={1000}
                onChange={(e) => {
                  let newFormData = { ...formData };
                  newFormData["Days"] = e.target.value;
                  setFormData(newFormData);
                }}
              ></input>
              <label> days.</label>
            </div>
            <button className="init-button" type="submit">
              Submit
            </button>
          </>
        ) : (
          " "
        )}
      </form>
      {stage !== 3 ? (
        <button
          onClick={() => document.querySelector("form")?.reportValidity() && setStage(stage + 1)}
          className="init-button"
        >
          Next
        </button>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
