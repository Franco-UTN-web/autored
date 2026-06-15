import { useState, useEffect } from 'react';
import './App.css'; // Aquí tendrías tus clases globales y variables de color

function Catalogo() {
  // Estado para guardar los datos que nos mande Java
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Aquí hacemos la llamada al servidor de Spring Boot
    fetch('http://localhost:8080/api/catalogo')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setProductos(datos); // Guardamos la lista de refacciones en el estado
      })
      .catch(error => console.error("Error conectando al servidor:", error));
  }, []);

  return (
    <div className="contenedor-principal">
      <h1>Catálogo de Autopartes</h1>
      
      <div className="grid-productos">
        {/* Recorremos la lista y creamos una tarjeta por cada producto */}
        {productos.map(producto => (
          <div key={producto.id} className="card-producto">
            <h3>{producto.nombre}</h3>
            <p className="precio-tag">${producto.precio}</p>
            <button className="btn-primario">Añadir al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;