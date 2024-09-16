import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState();


  const api = import.meta.env.VITE_API;

  useEffect(() => {
    setLoading(true); 
    fetch(api)
      .then((response) => response.json())
      .then((productos) => {
        setData(productos);  
        setLoading(false);   
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleBuyClick = (precio, id, title) => {
    setTotal(prevTotal => prevTotal + precio);
    var newtitle = title.replace(/\s+/g, '');
    setReference(`${id}${precio}${newtitle}${new Date().toISOString()}`);
  };

  const public_key = import.meta.env.VITE_PUBLIC_KEY;
  const currency = import.meta.env.VITE_CURRENCY;
  const ref = reference.replace(/[:]/g, '-').replace(/T/, '_', /\s+/g, '');
  const redirect = import.meta.env.VITE_REDIRECT; 
  const integration = import.meta.env.VITE_INTEGRATION;

  console.log(ref, "new reference");
  

  const loadWompiScript = async () => {
    const existingScript = document.getElementById('wompi-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Convertir total a centavos y añadir dos ceros al final
    const totalInCents = (total * 100).toString()+"0";

    // Secreto de integridad
    const secretIntegrity = `${ref}${totalInCents}${currency}${integration}`;
    
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

  if (loading) return <>Loading Products...</>

  return (
    <>
      <div className="container">
        <h1>Listado de Productos</h1>
        <div className="total-container">
          <span className="total-amount">
            Total Acumulado: ${total}00
          </span>
            <div id="wompi-checkout-button" className="wompi-button-container">
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
                  <button onClick={() => handleBuyClick(producto.precio, producto.id, producto.title)}>Añadir</button>
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
