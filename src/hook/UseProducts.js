import {useEffect, useState} from 'react'

const UseProducts = () => {
    const api = import.meta.env.VITE_API;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [total, setTotal] = useState(0);
    const [reference, setReference] = useState('');

    const getProducts = () => {
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
    }
    const handleBuyClick = (precio, id, title) => {
      setTotal(prevTotal => prevTotal + precio);
      var newtitle = title?.replace(/\s+/g, '');
      setReference(`${id}${precio}${newtitle}${new Date().toISOString()}`);
    };


    useEffect(() => {
        getProducts()
      }, []);

      return {data,
        loading, handleBuyClick, total,
        reference}
}

export default UseProducts