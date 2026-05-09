import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await req.json();
    const { name, email, phone, propertyLocation, acres, description, hearAbout } = body;

    if (!name || !email || !phone || !propertyLocation || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Happy Camper <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `🏕️ New landowner inquiry from ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #2D4A2D;">New Happy Camper Inquiry 🌲</h2>
          <p style="color: #5A6B5A;">A landowner just submitted the form on your site. Reach out within 24 hours for best results.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${propertyLocation}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Acreage</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${acres || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; vertical-align: top;"><strong>Description</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${description}</td></tr>
            <tr><td style="padding: 8px;"><strong>Heard via</strong></td><td style="padding: 8px;">${hearAbout || 'Not specified'}</td></tr>
          </table>

          <p style="margin-top: 30px; color: #5A6B5A; font-size: 13px;">— Happy Camper Bot 🏕️</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}