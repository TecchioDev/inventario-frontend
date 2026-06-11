import { useState } from "react";
import Box from "./Box";
import { Updatestuff } from "../context"
import { useContext } from "react";

function Shelf({ armario, estante, cajas, backtorack, backtomain}) {

  const [newbox, Setnewbox] = useState({
    bname: "",
    bdesc: "",
    bquant: 0,
    bprio: 3
  })
  const [whatbox, Setbox] = useState(null)
  const [addingbox, Isaddingbox] = useState(false)
  const fetchagain = useContext(Updatestuff)

  if (whatbox) {
    return (
      <div>
        <Box caja={whatbox} backtoshelf={() => Setbox(null)} backtomain={backtomain}/>
      </div>
    )
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
        rack: armario.number,
        shelf: estante,
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
      <header>
        <button onClick={() => backtorack()}>Volver al armario</button>
      </header>
      <section>
        {cajas.map((caja) => (
          caja.rack === armario.number && caja.shelf === estante && (
            <button key={caja.id} onClick={() => Setbox(caja)}>Caja de {caja.name}</button>
          )
        ))}
      </section>
      <footer>
        <button onClick={() => Isaddingbox(true)}>Añadir nueva caja</button>
      </footer>
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
  )

}

export default Shelf;
