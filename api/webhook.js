export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { status, customer_email, metadata, order_id } = req.body;
    
    console.log('Webhook received:', { status, customer_email, order_id });

    if (status === 'success' || status === 'completed') {
      
      const cart_items = JSON.parse(metadata.cart_items || '[]');
      const DRIVE_LINK = 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID';
      
      console.log('=== PAYMENT SUCCESSFUL ===');
      console.log('Customer Email:', customer_email);
      console.log('Order ID:', order_id);
      console.log('Items:', cart_items);
      console.log('Send Drive Link:', DRIVE_LINK);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Webhook processed' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook received' 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
