import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "normalize.css";
import logo from "./assets/logo-wide.svg";
import cog from "./assets/cog.svg";
import { emptyObject, getProteins } from "./assets/miranda";
import { getSupportedCodeFixes } from "typescript";
//import onPopupOpen from "./webscrap";
//import { on } from "events";

const capitalizeStr = (string:any) => string.charAt(0).toUpperCase() + string.slice(1);

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

function Header(props: any) {
  // @ts-ignore: Unreachable code error
  useEffect(
    () => {
      console.log("global updated to " + ("globalVar" in window ? window.globalVar : "?"));
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
            <div className="img-container" style={{height: "60px", width: "60px"}}><img src={cog} alt="" /></div>
          </a>
        </div>
      </div>
    </>
  );
}

const calculateNutrition = ({gender, weight, height, age, calories, protein, carbs, fat, fibre}: any) => {
  let bmr;
  // calculate BMR (basal metabolic rate) which is the number of calories burned at rest
  if (gender == "Male") {
      let bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
  } else {
      let bmr = 9.247 * weight + 3.098 * height - 4.33 * age + 447.593;
  }

  if (calories != null) {  // is user doesnt specifiy calories, we calculate it for them
      calories = bmr;
  };

  if (protein != null) {
      protein = (calories * 0.2)/4; // calculates protein in grams
  };

  if (fat != null) {   // calculates fat in grams
      fat = (calories * 0.3)/9;
  };

  if (carbs != null) {  // calculates carbs in grams
      carbs = (calories * 0.5)/4;
  };

  if (fibre != null) {  // calculates fibre in grams
      fibre = (calories/1000)*14;
  }

  // returns an object with all the nutrition values that the user should consume
  return {calories: calories, protein: protein, carbs: carbs, fat: fat, fibre: fibre};
}

function Overview({ listFn, type, realData, param }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);
  const BADTEXT = `Does not hit your ${type} goal per day!`;
  const MEDTEXT = `Almost at your ${type} goal per day!`;
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
  const data = realData;
  console.log(`real data is `);
  console.log(data);

  if (data.list.length === 0) return <></>;

  let dailyTotal = Math.round(10 * realData.total / param) / 10;

  let severity;
  let text;

  if (Math.abs(data.expected - dailyTotal) < data.expected * 0.10) {
    text = GOODTEXT;
    severity = "mint";
  } else if (Math.abs(data.expected - dailyTotal) < data.expected * 0.20) {
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
                  Math.round(10 * Math.abs(data.expected - dailyTotal)) / 10 + (type === "calories" ? "" : "g")
                } ${
                    data.expected > dailyTotal ? "more" : "less"
                  } ${type} per day to hit your goal of ${
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
  param: any;
};

type dataProp = {
  list: any;
  total: any;
  type: any;
  expected: any;
};

function Calculations({ listFn, type, realData, param }: calcProp) {
  const [isCollapsed, setCollapsed] = useState(false);

  // const [data, setData] = useState<dataProp>(emptyObject);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setData(await listFn());
  //   };
  //   fetchData().catch(console.error);
  // }, [listFn, data]);

  const data = realData;
  let dailyTotal = Math.round(10 * realData.total / param) / 10;
  function toggleCollapse() {
    setCollapsed(!isCollapsed);
  }
  let severity;
  if (data.total === undefined) {
    severity = "";
  } else {
    if (Math.abs(data.expected - dailyTotal) < data.expected * 0.10) {
      severity = "mint";
    } else if (Math.abs(data.expected - dailyTotal) < data.expected * 0.20) {
      severity = "yellow";
    } else {
      console.log(dailyTotal);
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
            <h2>{capitalizeStr(type)}</h2>
          </a>
          {isCollapsed ? (
            <h2 className="detail-number">
              {dailyTotal === undefined ? " " : dailyTotal + (type === 'calories' ? "" : "g") + " / " + data.expected  + (type === 'calories' ? "" : "g") }
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
                    <h2>{Math.round(10 * element.total / param) / 10}{type === "calories" ? "" : "g"}</h2>
                  </div>
                ))
              : "Loading..."}
            {dailyTotal === undefined ? (
              ""
            ) : (
              <>
                <div className="divider"></div>
                <div className="detail-total">
                  <h2>{dailyTotal}{type === "calories" ?"": "g"}</h2>
                  <h3>total per day</h3>
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

  const advancedInfo = ["Calories", "Protein", "Carbs", "Fat", "Fibre"];

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

function App() {
  //onPopupOpen();
  const [name, setName] = useState("");
  const [days, setDays] = useState(1);
  useEffect(() => {
    chrome.storage.sync.get(["Name"], (result) => {
      setName(result.Name);
    });
    chrome.storage.sync.get(['Days'], (result) => {
      setDays(result.Days);
      console.log(result.Days);
    });
  });
  const updateName = () => {
    setName("");
  };

  const [proteinData, SetProteinData] = useState<macroData>({
    type: "protein",
    total: 0,
    expected: 70,
    list: [],
  });

  const [fatData, SetFatData] = useState<macroData>({
    type: "fat",
    total: 0,
    expected: 65,
    list: [],
  });

  const [carbsData, SetCarbsData] = useState<macroData>({
    type: "carbs",
    total: 0,
    expected: 130,
    list: [],
  });

  const [fibreData, SetFibreData] = useState<macroData>({
    type: "fibre",
    total: 0,
    expected: 25,
    list: [],
  });

  const [caloriesData, SetCaloriesData] = useState<macroData>({
    type: "calories",
    total: 0,
    expected: 2250,
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
        newProteinData.list = [...newProteinData.list, 
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.protein ? item.protein : 0
          }
        ];
        newFatData.list = [...newFatData.list,
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.fat ? item.fat : 0
          }
        ];
        newCarbsData.list = [...newCarbsData.list,
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.carbs ? item.carbs : 0
          }
        ];
        newFibreData.list = [...newFibreData.list,
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.fibre ? item.fibre : 0
          }
        ];
        newCaloriesData.list = [...newCaloriesData.list,
          {
            name: item.name,
            src: item.src,
            weight: item.weight,
            total: item.calories ? item.calories : 0
          }
        ];
      });
      console.log(`days are ${days}`);
      newProteinData.expected *= days;
      newProteinData.total += globalCart.protein;
      SetProteinData(newProteinData);
      newFatData.expected *= days;
      newFatData.total += globalCart.fat;
      SetFatData(newFatData);
      newFibreData.expected *= days;
      newFibreData.total += globalCart.fibre;
      SetFibreData(newFibreData);
      newCarbsData.expected *= days;
      newCarbsData.total += globalCart.carbs;
      SetCarbsData(newCarbsData);
      newCaloriesData.expected *= days;
      newCaloriesData.total += globalCart.calories;
      SetCaloriesData(newCaloriesData);
    }
    }, 1000);
    return () => {
      clearInterval(key);
    };
  }, []);

  let params = {};

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
              <Overview listFn={getProteins} type={"calories"} realData={caloriesData} param={days}></Overview>
              <Overview listFn={getProteins} type={"protein"} realData={proteinData} param={days}></Overview>
              <Overview listFn={getProteins} type={"carbs"} realData={carbsData} param={days}></Overview>
              <Overview listFn={getProteins} type={"fat"} realData={fatData} param={days}></Overview>
              <Overview listFn={getProteins} type={"fibre"} realData={fibreData} param={days}></Overview>
            </div>
            <div className="calculations">
              <div className="calculation-header">
                <h2>Details</h2>
              </div>
              <Calculations listFn={getProteins} type={"calories"} realData={caloriesData} param={days}></Calculations>
              <Calculations listFn={getProteins} type={"protein"} realData={proteinData} param={days}></Calculations>
              <Calculations listFn={getProteins} type={"carbs"} realData={carbsData} param={days}></Calculations>
              <Calculations listFn={getProteins} type={"fat"} realData={fatData} param={days}></Calculations>
              <Calculations listFn={getProteins} type={"fibre"} realData={fibreData} param={days}></Calculations>
            </div>
          </>
        )}
        <Footer></Footer>
      </div>
    </div>
  );
}

export default App;
