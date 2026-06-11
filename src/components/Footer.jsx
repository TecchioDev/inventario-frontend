import { useContext } from "react";
import { Updatestuff } from "../context";

function Navbar({ Appview }) {
  const fetchagain  = useContext(Updatestuff)
  return (
    <footer>
      <hr />
      <nav>
        <button onClick={() => { Appview("allracks"); fetchagain()}}>Armarios</button>
        <button onClick={() => { Appview("control"); fetchagain()}}>Registro</button>
      </nav>
    </footer>
  );
}

export default Navbar;
