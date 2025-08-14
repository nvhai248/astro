import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS,
      },
    });

    // Email to site owner
    const ownerMailOptions = {
      from: import.meta.env.EMAIL_USER,
      to: import.meta.env.OWNER_EMAIL,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: monospace; background: #000; color: #fff; padding: 20px;">
          <h2 style="color: #00FF41; font-size: 16px;">&gt; NEW CONTACT FORM SUBMISSION_</h2>
          <div style="border: 1px solid #808080; padding: 15px; margin: 15px 0;">
            <p><strong style="color: #00FF41;">FROM:</strong> ${email}</p>
            <p><strong style="color: #00FF41;">SUBJECT:</strong> ${subject}</p>
            <p><strong style="color: #00FF41;">MESSAGE:</strong></p>
            <div style="background: #404040; padding: 10px; margin-top: 10px; white-space: pre-wrap;">${message}</div>
          </div>
          <p style="color: #808080; font-size: 12px;">Sent from Portfolio Contact Form</p>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: import.meta.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: monospace; background: #000; color: #fff; padding: 20px;">
          <h2 style="color: #00FF41; font-size: 16px;">&gt; MESSAGE RECEIVED_</h2>
          <div style="border: 1px solid #808080; padding: 15px; margin: 15px 0;">
            <p>Hi there!</p>
            <p>Thanks for reaching out. I've received your message about "${subject}" and will get back to you within 24-48 hours.</p>
            <p>Your message:</p>
            <div style="background: #404040; padding: 10px; margin-top: 10px; white-space: pre-wrap;">${message}</div>
          </div>
          <p style="color: #808080; font-size: 12px;">Best regards,<br/>Portfolio Team</p>
        </div>
      `,
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};