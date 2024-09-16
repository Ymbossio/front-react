
import './App.css';
import UseProducts from './hook/UseProducts';
import HeaderProducts from './components/HeaderProducts';
import CardProduct from './components/CardProduct';
import useWompi from './hook/useWonpi';
import CenteredLoader from './components/CenteredLoader';

function App() {
  const {data,
        loading, 
        handleBuyClick, 
        total,
        reference
        
      } = UseProducts()

      useWompi({total, reference})


  if (loading) return <CenteredLoader />

  return (
    <>
      <div className="container">
          <HeaderProducts total={total}/>
        <div className="card-grid">
          {data.map((producto) => (
            <CardProduct key={producto.id} producto={producto} handleBuyClick={handleBuyClick} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;





