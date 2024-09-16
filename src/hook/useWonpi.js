import {currency, integration, public_key, redirect} from "../const/const"
import { useEffect } from "react";
const useWompi = ({total, reference}) => {

    const ref = (reference) => reference?.replace(/[:]/g, '-')?.replace(/T/, '_', /\s+/g, '');

    const loadWompiScript = async () => {
        const existingScript = document.getElementById('wompi-script');
        if (existingScript) {
          existingScript.remove();
        }
    
        // Convertir total a centavos y añadir dos ceros al final
        const totalInCents = (total * 100).toString()+"0";
    
        // Secreto de integridad
        const secretIntegrity = `${ref(reference)}${totalInCents}${currency}${integration}`;
        
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
}

export default useWompi