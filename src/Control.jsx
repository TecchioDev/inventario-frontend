import { useContext} from "react";
import { Updatestuff } from "./context";

function Control({ logs }) {

  const fetchagain = useContext(Updatestuff)

  function Deletelog(which) {
    fetch(`${import.meta.env.VITE_BACKEND}/log/${which}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchagain();
      })
  }

  return (
    <main>
      <h1>Registro</h1>
      {logs.map((row) => (
        <div key={row.id} className="logrow">
          <span>{row.action}: </span>
          <span>{row.description} </span>
          <span>{new Date(row.date).toLocaleString('es-ES')}{}</span>
          <button onClick={() => Deletelog(row.id)}>Borrar</button>
        </div>
      ))}
    </main>
  )
}

export default Control;
