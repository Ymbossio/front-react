/* eslint-disable react/prop-types */

const HeaderProducts  = ({total}) => {
    return (
     <>
     <h1>Listado de Productos</h1>
         <div className="total-container">
           <div>
             <span className="total-amount">
               Total Acumulado: {total ? total?.toFixed(2) : "0"}
             </span>
               <div id="wompi-checkout-button" className="wompi-button-container">
             </div>
           </div>
 
         </div>
       </>
    )
 }
export default HeaderProducts