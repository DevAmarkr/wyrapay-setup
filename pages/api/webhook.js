export default function handler(req, res) {
  if (req.method === 'POST') {
    const payload = req.body; // Assuming the webhook payload is JSON

    // Process the webhook payload here
    console.log('Received webhook payload:', payload);

    // Respond with a success message
    res.status(200).json({ message: 'Webhook received successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}