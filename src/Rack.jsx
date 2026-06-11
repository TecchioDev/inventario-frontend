import { useState } from "react";
import { range } from "./utils"
import Shelf from "./components/Shelf"

function Rack({ armario, cajas, backtomain }) {
  const [whatshelf, Setshelf] = useState(null)

  if (whatshelf === null) {
    return (
      <div>
        <button onClick={() => backtomain()}>Volver a racks</button>
        {range(armario.shelves).map((estante) => {
          const cajasEnEstante = cajas.filter(caja => caja.shelf === estante && caja.rack === armario.number)
          return (
            <div key={estante}>
              <button onClick={() => Setshelf(estante)}>Estante {estante}</button>
              {cajasEnEstante.length > 0 ? (
                <div>
                  <h2>Tiene cajas de:</h2>
                  {cajasEnEstante.map(caja => (
                    <span key={caja.id}>{caja.name} </span>
                  ))}
                </div>
              ) : <h2>Estante vacía</h2>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <Shelf armario={armario} estante={whatshelf} cajas={cajas} backtorack={ () => Setshelf(null)} backtomain={backtomain} />
    </div>
  );
}

export default Rack;
