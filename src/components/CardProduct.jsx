/* eslint-disable react/prop-types */
import React from 'react'

const CardProduct = ({producto, handleBuyClick}) => {
    return (
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
    )
  }

export default CardProduct