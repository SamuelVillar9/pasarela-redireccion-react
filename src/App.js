import "./App.css";
import CryptoJS from "crypto-js";

function App() {

  function createMerchantParameters(params) {
    let merchantParameters = CryptoJS.enc.Utf8.parse(JSON.stringify(params));
    let merchantBase64 = merchantParameters.toString(CryptoJS.enc.Base64);

    return merchantBase64;
  }

  function createMerchatSignature(params, merchantBase64) {
    const claveComercio = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

    // Decode key
    let decodeKey = CryptoJS.enc.Base64.parse(claveComercio);

    // Generate transaction key
    let iv = CryptoJS.enc.Hex.parse("0000000000000000");
    let cipher = CryptoJS.TripleDES.encrypt(
      params.DS_MERCHANT_ORDER,
      decodeKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      }
    );

    // Sign
    let signature = CryptoJS.HmacSHA256(merchantBase64, cipher.ciphertext);
    let signatureBase64 = signature.toString(CryptoJS.enc.Base64);

    return signatureBase64;
  }

  function generarNumeroPedido() {
    // Generar los primeros 4 caracteres numéricos
    let numeros = Math.floor(1000 + Math.random() * 9000).toString();

    // Generar los siguientes 8 caracteres alfanuméricos
    let caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let alfanumericos = "";
    for (let i = 0; i < 8; i++) {
      alfanumericos += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }

    // Combinar ambos para obtener el número de pedido
    return numeros + alfanumericos;
  }

  let data = {
    DS_MERCHANT_AMOUNT: "145",
    DS_MERCHANT_CURRENCY: "978",
    DS_MERCHANT_MERCHANTCODE: "999008881",
    DS_MERCHANT_MERCHANTURL: "http://www.prueba.com/urlNotificacion",
    DS_MERCHANT_ORDER: generarNumeroPedido(),
    DS_MERCHANT_TERMINAL: "1",
    DS_MERCHANT_TRANSACTIONTYPE: "0",
    DS_MERCHANT_URLKO: "http://www.prueba.com/urlKO",
    DS_MERCHANT_URLOK: "http://www.prueba.com/urlOK",
  };

  let dsmerchantParameters = createMerchantParameters(data);

  let dsSignature = createMerchatSignature(data, dsmerchantParameters);

  let dsSignatureVersion = "HMAC_SHA256_V1";

  return (
    <div className="App">
      <div>
        <h1>PASARELA DE PAGO POR REDIRECCIÓN DE REDSYS</h1>
        <h2>Realizado con REACT</h2>
        <br />
        <h2>Parámetros a enviar</h2>
        <p>DS_MERCHANT_AMOUNT: {data.DS_MERCHANT_AMOUNT}</p>
        <p>DS_MERCHANT_CURRENCY: {data.DS_MERCHANT_CURRENCY}</p>
        <p>DS_MERCHANT_MERCHANTCODE: {data.DS_MERCHANT_MERCHANTCODE}</p>
        <p>DS_MERCHANT_MERCHANTURL: {data.DS_MERCHANT_MERCHANTURL}</p>
        <p>DS_MERCHANT_ORDER: {data.DS_MERCHANT_ORDER}</p>
        <p>DS_MERCHANT_TERMINAL: {data.DS_MERCHANT_TERMINAL}</p>
        <p>DS_MERCHANT_TRANSACTIONTYPE: {data.DS_MERCHANT_TRANSACTIONTYPE}</p>
        <p>DS_MERCHANT_URLKO: {data.DS_MERCHANT_URLKO}</p>
        <p>DS_MERCHANT_URLOK: {data.DS_MERCHANT_URLOK}</p>
        <br />
        <h2>DS_MERCHANTPARAMETERS BASE64</h2>
        <textarea value={dsmerchantParameters} cols="125" rows="7" />
      </div>
      <div>
        <h2>EJEMPLO FORMULARIO DE PAGO</h2>
        <form
          name="formularioPago"
          method="POST"
          action="https://sis-t.redsys.es:25443/sis/realizarPago"
        >
          <label>DS_MERCHANTPARAMETERS</label>
          <br />
          <input
            type="text"
            name="DS_MERCHANTPARAMETERS"
            value={dsmerchantParameters}
          />
          <br />
          <label>DS_SIGNATURE</label>
          <br />
          <input type="text" name="DS_SIGNATURE" value={dsSignature} />
          <br />
          <label>DS_SIGNATUREVERSION</label>
          <br />
          <input
            type="text"
            name="DS_SIGNATUREVERSION"
            value={dsSignatureVersion}
          />
          <br />
          <input type="submit" value="REALIZAR PAGO" />
        </form>
      </div>
    </div>
  );
}

export default App;
