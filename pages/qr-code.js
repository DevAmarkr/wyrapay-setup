import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode.react';

const QRCodePage = () => {
  const [qrData, setQRData] = useState();
  const [qrTrans, setTransData] = useState();

  // const payload = {
  //   value: 0,
  //   description: "string",
  //   client_name: "string",
  //   client_email: "string",
  //   client_document: "27262926667",
  //   merchant_id: "PBKY",
  //   external_transaction_id: "string",
  // }
  const headers = {
    "accept": "application/json",
    "content-type": "application/*+json",
    "x-api-key": "ee65c4b7ebd17cb03d4ce98d92f4462b5df80e9c576f088f4bb2bb54f49d1f40b7eb01728c9d8b52bdaa8b7a879f894ca013d81635b2f4ec1c82aa49ddc6d52f"
  }
  const key = "00020101021226950014br.gov.bcb.pix2573qr.cornerpix.com.br/11581339/v2/cobv/2eb409d1-6a36-4ade-9b86-3c05872226707315204000053039865802BR5914BMP MONEY PLUS6009SAO PAULO62070503***63045E9D"


  const checkout = async () => {
    const transactional_url = "https://api-sandbox.wyrapay.com/v1/api/checkout/start"
    const payload = {
      value: 100,
      description: "Wallet Address",
      client_name: "Amar",
      client_email: "amar@ne",
      client_document: "27262926667",
      merchant_id: "PBKY",
      external_transaction_id: "string",
      external_client_id: "string",
      currency: "INR",
      callback_url: "https://c244-122-172-86-147.ngrok-free.app/qr-code",
      transaction_info: {
        label_text: "string",
        value_text: "string"
      }
    }
    const response = await fetch(transactional_url, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: headers
    });
    // window.location.assign(response.url)

    if (!response.ok) {
      throw new Error('Failed to fetch QR code data');
    }
    const data = await response.json();
    console.log(data)
    localStorage.setItem('merchant_id', data?.merchant_id)
    localStorage.setItem('transaction_uuid', data?.transaction_uuid)
    window.location.assign(data.redirect_url, '_blank')
    // setTransData(data);
  }

  const status = async () => {
    const merchant_id = localStorage.getItem('merchant_id')
    const transactionUuid = localStorage.getItem('transaction_uuid')
    if (merchant_id && transactionUuid) {
      const url = `https://api-sandbox.wyrapay.com/v1/api/${merchant_id}/checkout/${transactionUuid}/status`

      const response = await fetch(url, {
        method: 'get',
        // body: JSON.stringify(payload),
        headers: headers
      });
      // window.location.assign(response.url)

      if (!response.ok) {
        throw new Error('Failed to fetch QR code data');
      }
      const data = await response.json();
      setQRData(data)
    }
  }

  useEffect(() => {
    status()
  }, [])

  const start = (e) => {
    e.preventDefault();
    checkout()
  }
  const checkStatus = (e) => {
    e.preventDefault();
    checkout()
  }


  if (typeof window !== 'undefined') {
    console.log(localStorage.getItem('merchant_id'), 'merchant_id')
    console.log(localStorage.getItem('transaction_uuid'), 'transaction_uuid')

  }



  // https://example.com/v1/api/{merchant_id}/checkout/{transactionUuid}/status


  return (
    <div style={{ marginLeft: '43rem', marginTop: '25rem', }}>
      {/* {qrData && <QRCode value={qrData.qr_code} />}
      {!qrData && <p>Loading QR code...</p>} */}
      <button style={{ marginRight: '5rem', fontSize: '2rem', background:'yellow', border:'none', padding:'1rem' }} onClick={start}>Start payment</button>
      <button style={{ fontSize: '2rem', background: 'pink', border: 'none', padding: '1rem' }} onClick={status}>Check Status</button>
      <div style={{ marginTop: '5rem' }}>
        <h2>Last transaction status check</h2>
        <span style={{ marginRight: '5rem', fontSize: '2rem' }}>{qrData?.transaction_uuid || 'Loading...'}</span>
        <span style={{ fontSize: '2rem', }}>{qrData?.status}</span>
      </div>
    </div>
  );
};

export default QRCodePage;
