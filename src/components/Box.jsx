import { useState, useContext, useEffect } from "react";
import { Heldboxcont, Updatestuff } from "../context";
import "../style/Box.css";

function sendAlert(box) {
  fetch(`${import.meta.env.VITE_BACKEND}/alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: box.id })
  })
}

function Box({ caja, backtoshelf, backtomain }) {
  const [boxstuff, Addtobox] = useState({
    "name": caja.name,
    "description": caja.description,
    "quantity": caja.quantity,
    "priority": caja.priority
  });
  const [isediting, Setedit] = useState(null);
  const [isdeleting, Setdeleting] = useState(false)
  const { heldbox, Setholdbox } = useContext(Heldboxcont)
  const fetchagain = useContext(Updatestuff)

  useEffect(() => { if (heldbox) backtomain() }, [backtomain, heldbox] )

  function Prioritycolor(targetset) {
    let classes = []
    if (boxstuff["priority"] === targetset) classes.push("selected")
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

  function changebox(what, newvalue) {
    if (typeof newvalue === 'number') {
      if (newvalue < 0) {
        console.log("no negatives past here");
        return;
      }
      if (boxstuff["priority"] === 3 && newvalue === 5) sendAlert(caja)
      if (boxstuff["priority"] === 2 && newvalue === 3) sendAlert(caja)
      if (boxstuff["priority"] === 1 && newvalue === 1) sendAlert(caja)
    }


    fetch(`${import.meta.env.VITE_BACKEND}/cajas/${caja.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [what]: newvalue })
    })
      .then(res => res.json())
      .then(() => Addtobox({ ...boxstuff, [what]: newvalue }));
  }

  function Updatedata(which, newdata) {
    Setedit(null);
    changebox( which, newdata );
  }

  function Inputboxes(what) {
    if (isediting === what) {
      return (
        <input
          value={boxstuff[what]}
          onChange={event => Addtobox({ ...boxstuff, [what]: event.target.value })}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              Updatedata(what, boxstuff[what])
            }
          }}
          onBlur={() => Updatedata(what, boxstuff[what])}
          autoFocus
        />
      );
    } else {
      return (<span onClick={() => Setedit(what)}>{boxstuff[what]}</span>);
    }
  }

  function Deletebox() {
    backtoshelf()
    fetch(`${import.meta.env.VITE_BACKEND}/cajas/${caja.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        Setdeleting(false);
        fetchagain();
        backtoshelf();
      })
  }

  return (
    <div>
      <button onClick={() => backtoshelf()}>Volver a la estante</button>
      <h2>Caja de {Inputboxes("name")}</h2>
      <h3>Descripcion:</h3>
      {Inputboxes("description")}
      <h3>Cantidad</h3>
      <button onClick={() => changebox( "quantity", boxstuff["quantity"] -1)}>-</button>
      {Inputboxes("quantity")}
      <button onClick={() => changebox("quantity", boxstuff["quantity"] +1)}>+</button>
      <br />
      <h3>Prioridad</h3>
      <button onClick={() => changebox("priority", 3)} className={Prioritycolor(3)}>Baja</button>
      <button onClick={() => changebox("priority", 2)} className={Prioritycolor(2)}>Mediana</button>
      <button onClick={() => changebox("priority", 1)} className={Prioritycolor(1)}>Alta</button>
      <button onClick={() => Setholdbox(caja.id)}>Mover</button>
      <button onClick={() => sendAlert(caja)}>ENVIAR CORREO</button>

      <button onClick={() => {
        Setdeleting(true)
      }}>Borrar</button>

      {isdeleting && (
        <div className="overlay">
          <div className="boxOverlay">
            <h2>¿Quieres borrar la caja {caja.name}? <br />Esta acción no se podrá deshacer</h2>
            <button onClick={ () => Deletebox()}>Si, borrarla</button>
            <button onClick={() => Setdeleting(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Box;
