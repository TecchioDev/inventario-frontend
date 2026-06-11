import { useState, useEffect } from "react";
import Allracks from "./Allracks";
import Control from "./Control";
import Navbar from "./components/Footer";
import { Heldboxcont, Updatestuff } from "./context";

function App() {
  const [view, Changeview] = useState("allracks");
  const [cajas, Setcajas] = useState([]);
  const [armarios, Setarmarios] = useState([]);
  const [log, Addlog] = useState([])
  const [heldbox, Setholdbox] = useState(null);

  function fetchdata() {
    fetch(`${import.meta.env.VITE_BACKEND}/cajas`)
      .then((res) => res.json())
      .then((data) => Setcajas(data));
    fetch(`${import.meta.env.VITE_BACKEND}/armarios`)
      .then((res) => res.json())
      .then((data) => Setarmarios(data));
    fetch(`${import.meta.env.VITE_BACKEND}/log`)
      .then((res) => res.json())
      .then((data) => Addlog(data));
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      <h1>Inventario</h1>
      <hr />
      <Heldboxcont.Provider value={{ heldbox, Setholdbox }}>
      <Updatestuff.Provider value={fetchdata}>
        {view === "allracks" ? (
          <Allracks armarios={armarios} cajas={cajas} />
        ) : view === "control" && (
          <Control logs={log} />
        )}
        <Navbar Appview={Changeview} />
      </Updatestuff.Provider>
      </Heldboxcont.Provider>
    </div>
  );
}

export default App;
