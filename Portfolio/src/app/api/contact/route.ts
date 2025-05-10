// import { NextResponse } from 'next/server'

// interface ContactRequestBody {
//   name: string;
//   email: string;
//   message: string;
// }

// export async function POST(request: Request) {
//   try {
//     await request.json() as ContactRequestBody
//     // Here you would typically:
//     // 1. Validate the input
//     // 2. Send an email using a service like SendGrid, AWS SES, etc.
//     // 3. Store the message in a database if needed

//     // For now, we'll just simulate a successful response
//     return NextResponse.json(
//       { message: 'Message sent successfully' },
//       { status: 200 }
//     )
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
//     return NextResponse.json(
//       { message: errorMessage },
//       { status: 500 }
//     )
//   }
// } 
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json() as ContactRequestBody

    // Create reusable transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password (not normal password)
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email,             // User's email so you can reply directly
      subject: `New Contact from ${name}`,
      text: `You received a message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
    console.error('Email error:', errorMessage)

    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
