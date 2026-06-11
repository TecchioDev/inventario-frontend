import { useState, useContext } from "react";
import { range } from "./utils";
import Rack from "./Rack";
import Box from "./components/Box";
import { Heldboxcont, Updatestuff} from "./context";

function RackSlide({ armario }) {
  return (
    <div className="rack-slide">
      <span className="rack-title">Armario {armario.number}</span>
      <div className="rack-body">
        {range(armario.shelves).map((shelf) => (
          shelf !== 1 &&
          <div key={shelf} className="rack-shelf" />
        ))}
      </div>
    </div>
  );
}

function RackView({ armarios, cajas }) {
  const [whatrack, Setrack] = useState(null);
  const [chosenbox, Selectbox] = useState(null);
  const [current, setCurrent] = useState(0);
  const [addingbox, Isaddingbox] = useState(false);
  const { heldbox, Setholdbox } = useContext(Heldboxcont);
  const groundboxes = cajas.filter(c => c.rack === 0);
  const trueracks = armarios.filter(i => i.number !== 0);
  const fetchagain = useContext(Updatestuff)
  const [newbox, Setnewbox] = useState({
    bname: "",
    bdesc: "",
    bquant: 0,
    bprio: 3
  })

  if (!armarios || armarios.length === 0) {
    return <div>Cargando...</div>;
  }

  function prev() { setCurrent(i => (i - 1 + trueracks.length) % trueracks.length); }
  function next() { setCurrent(i => (i + 1) % trueracks.length); }

  function Movebox(rackplace, shelfplace) {
    fetch(`${import.meta.env.VITE_BACKEND}/cajas/${heldbox}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rack: rackplace, shelf: shelfplace }),
    })
      .then(res => res.json())
      .then(() => fetchagain())
      .then(() => {
        Setholdbox(null);
      });
  }

  if (chosenbox) {
    return <Box caja={chosenbox} backtoshelf={() => Selectbox(null)} backtomain={() => Selectbox(null)}/>
  }

  if (whatrack) {
    return <Rack armario={whatrack} cajas={cajas} backtomain={() => Setrack(null)} />;
  }

  if (heldbox) {
    return (
      <div className="move-picker">
        {armarios.map((armario) => (
          <div key={armario.id}>
            {armario.number === 0 ? <button onClick={() => Movebox(0, 1)}>Cajas extra</button>
              : (
              <div>
              <h2>Armario {armario.number}</h2>
              {range(armario.shelves).map((shelf) => (
                <button key={shelf} onClick={() => Movebox(armario.number, shelf)}>
                  Estante {shelf}
                </button>
              ))}
              </div>
            )}
          </div>
        ))}
        <button onClick={() => Setholdbox(null)}>Cancelar mover Caja</button>
      </div>
    );
  }

  function Prioritycolor(targetset) {
    let classes = []
    if (newbox["priority"] === targetset) classes.push("selected")
    else classes.push("idle")

    switch (targetset) {
      case 1:
        classes.push("high");
        break;
      case 2:
        classes.push("mid");
        break;
      case 3:
        classes.push("low");
        break;
    }

    return(classes.join(" "))
  }

  function Addbox({ bname, bdesc, bquant, bprio }) {
    fetch(`${import.meta.env.VITE_BACKEND}/cajas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bname,
        description: bdesc,
        rack: 0,
        shelf: 1,
        quantity: bquant,
        priority: bprio
      })
    })
      .then(res => res.json)
      .then(() => Isaddingbox(false))
      .then(() => fetchagain())
  }

  return (
    <div>
      <h2>Armarios</h2>
      <div className="rack-carousel">
        <div className="carousel-stage">
          <button className="carousel-arrow" onClick={prev}>‹</button>
          <div className="carousel-view" onClick={() => Setrack(trueracks[current])}>
            <RackSlide armario={trueracks[current]} />
          </div>
          <button className="carousel-arrow" onClick={next}>›</button>
        </div>
        <div className="carousel-dots">
          {trueracks.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? "dot-active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
      <div className="extras">
        {groundboxes.map((caja) => (
          <button key={caja.id} onClick={() => Selectbox(caja)}>Caja de {caja.name}</button>
        ))}
      </div>
      <div>
        <button onClick={() => Isaddingbox(true)}>Añadir caja</button>
        {addingbox && (
          <div className="boxcreator">
            <h2>Nueva Caja</h2>
            <div> <label>Nombre: </label><input type="text" onChange={event => Setnewbox({ ...newbox, "bname": event.target.value })} /> </div>
            <div> <label>Descripcion: </label><textarea rows="5" cols="40" onChange={event => Setnewbox({ ...newbox, "bdesc": event.target.value })} /> </div>
            <div> <label>Quantity: </label><input type="number" min="0" onChange={event => Setnewbox({ ...newbox, "bquant": event.target.value })} /> </div>
            <div>
              <label>Priority: </label>
              <button onClick={() => Setnewbox({ ...newbox, "bprio": 3})} className={Prioritycolor(3)}>Baja</button>
              <button onClick={() => Setnewbox({ ...newbox, "bprio": 2})} className={Prioritycolor(2)}>Mediana</button>
              <button onClick={() => Setnewbox({ ...newbox, "bprio": 1 })} className={Prioritycolor(1)}>Alta</button>
            </div>
            <button onClick={() => Addbox(newbox)}>Crear</button>
            <button onClick={() => Isaddingbox(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RackView;
