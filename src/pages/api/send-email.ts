export const prerender = false;
import type { APIRoute } from "astro";
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = locals.runtime?.env || {};
  const apiKey = runtimeEnv.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
  const contactEmail = runtimeEnv.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL;

    if (!apiKey) {
      return new Response(JSON.stringify({
        message: "Missing RESEND_API_KEY environment variable. If running on Cloudflare, ensure it is set in the Dashboard.",
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resend = new Resend(apiKey);

    try {
      const data = await request.json();
      const { name, email, message } = data;

      if (!name || !email || !message) {
        return new Response(JSON.stringify({
          message: "Missing required fields",
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // --- Email Routing Configuration ---
      
      // 1. SENDER (From):
      // Must be an address from your verified domain (excel2vcf.com).
      // Standard practice for support forms.
      const fromEmail = "support@excel2vcf.com"; 

      // 2. RECIPIENT (To):
      // Where you actually want to read the emails.
      // You want to receive them at your 139.com address.
      const toEmail = "donghe587@139.com"; 

      // Note: This setup REQUIRES that 'excel2vcf.com' is verified in Resend.
      // If not verified yet, this will fail.

      const { data: resendData, error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
        `,
        replyTo: email,
      });

      if (error) {
        console.error("Resend Error:", error);
        return new Response(JSON.stringify({
          message: error.message,
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        message: "Email sent successfully",
        data: resendData
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (e: any) {
      console.error("Server Error:", e);
      return new Response(JSON.stringify({
        message: e.message || "Internal Server Error",
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
};
