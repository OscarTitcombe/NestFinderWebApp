# Supabase Edge Function: Send Email Notification

This is an **optional alternative** to the Next.js API route for sending email notifications.

## When to Use This

- You want to trigger emails from database triggers (automatic)
- You prefer serverless functions over API routes
- You want to decouple email sending from your Next.js app

## Setup

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Set secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_key
   supabase secrets set RESEND_FROM_EMAIL="NestFinder <notifications@yourdomain.com>"
   supabase secrets set NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```
5. Deploy: `supabase functions deploy send-email-notification`

## Database Trigger Setup

After deploying, create a database trigger:

```sql
-- Create function to call Edge Function
CREATE OR REPLACE FUNCTION notify_buyer_on_contact()
RETURNS TRIGGER AS $$
DECLARE
  buyer_request_data RECORD;
BEGIN
  -- Get buyer request details
  SELECT * INTO buyer_request_data
  FROM buyer_requests
  WHERE id = NEW.buyer_request_id;

  -- Call Edge Function (requires http extension)
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'to', buyer_request_data.email,
        'buyerRequest', jsonb_build_object(
          'budget_min', buyer_request_data.budget_min,
          'budget_max', buyer_request_data.budget_max,
          'beds_min', buyer_request_data.beds_min,
          'beds_max', buyer_request_data.beds_max,
          'property_type', buyer_request_data.property_type,
          'postcode_districts', buyer_request_data.postcode_districts
        ),
        'sellerEmail', NEW.seller_email,
        'message', NEW.message
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_contact_created
  AFTER INSERT ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION notify_buyer_on_contact();
```

**Note:** This requires the `http` extension and service role key setup. The Next.js API route approach is simpler for most use cases.


