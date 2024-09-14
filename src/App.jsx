import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/productos')
      .then(response => response.json())
      .then(productos => setData(productos))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleBuyClick = (precio) => {
    setTotal(prevTotal => prevTotal + precio);
  };

  const public_key = import.meta.env.VITE_PUBLIC_KEY;
  const currency = import.meta.env.VITE_CURRENCY;
  const reference = import.meta.env.VITE_REFERENCE;
  const redirect = import.meta.env.VITE_REDIRECT; 
  const integration = import.meta.env.VITE_INTEGRATION;

  const loadWompiScript = async () => {
    const existingScript = document.getElementById('wompi-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Convertir total a centavos y añadir dos ceros al final
    const totalInCents = (total * 100).toString()+"0";

    console.log("nuevo total en centavos con ceros añadidos", totalInCents);

    console.log(public_key, "key public");
    console.log(currency, "currency");
    console.log(reference, "reference");
    console.log(redirect, "redirect");
    console.log(integration, "integration");
    
        

    // Secreto de integridad
    const secretIntegrity = `${reference}${totalInCents}${currency}${integration}`;
    console.log(secretIntegrity, "secreto");
    
    const encodedText = new TextEncoder().encode(secretIntegrity);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    console.log(hashHex);

    const script = document.createElement('script');
    script.id = 'wompi-script';
    script.type = 'text/javascript';
    script.src = 'https://checkout.wompi.co/widget.js';
    script.setAttribute('data-public-key', public_key);
    script.setAttribute('data-currency', currency);
    script.setAttribute('data-amount-in-cents', totalInCents + "00");
    script.setAttribute('data-reference', reference);
    script.setAttribute('data-redirect-url', redirect);
    script.setAttribute('data-render', 'button');

    const div = document.getElementById('wompi-checkout-button');
    if (div) {
      div.innerHTML = '';
      div.appendChild(script);
    }
  }

  useEffect(() => {
    if (total > 0) {
      loadWompiScript();
    }
  }, [total]);

  return (
    <>
      <div className="container">
        <h1>Listado de Productos</h1>
        <div className="total-container">
          <span className="total-amount">
            Total Acumulado: ${total}00
          </span>
          <div id="wompi-checkout-button" className="wompi-button-container">
            {/* Aquí se cargará el botón de Wompi */}
          </div>
        </div>
        <div className="card-grid">
          {data.map((producto) => (
            <React.Fragment key={producto.id}>
              <div className="card">
                <div className="card-content">
                  <img src={producto.imagen} alt={producto.title} />
                  <h2>{producto.title}</h2>
                  <p>{producto.descripcion}</p>
                  <span>${producto.precio}00</span>
                  <br />
                  <button onClick={() => handleBuyClick(producto.precio)}>Añadir</button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
