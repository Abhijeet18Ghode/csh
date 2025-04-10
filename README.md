# AlumNet - Career Support Platform

A platform where verified alumni can share placement resources, and students can browse, bookmark, and request mentorship. Admins manage the platform.

## Features

- Role-based access control (Admin, Alumni, Student)
- Resource sharing (interview experiences, resume templates, study materials)
- Mentorship system
- Event management
- Company insights
- Email notifications
- Analytics dashboard

## Tech Stack

- Frontend & Backend: Next.js (JavaScript)
- Database: MongoDB (Mongoose)
- Authentication: NextAuth
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- SMTP server for email functionality

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alumnet.git
   cd alumnet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/alumnet
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   EMAIL_SERVER_HOST=smtp.example.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@example.com
   EMAIL_SERVER_PASSWORD=your-email-password
   EMAIL_FROM=noreply@alumnet.com
   COLLEGE_EMAIL_DOMAIN=college.edu
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                 # Utility functions
├── models/              # MongoDB models
├── middleware.js        # Authentication middleware
└── styles/              # Global styles
```

## User Roles

### Admin
- Full control over users, content, and platform settings
- Content moderation
- Analytics dashboard
- User management

### Alumni
- Upload interview experiences
- Offer referrals
- Host events
- Mentor students

### Student
- Browse resources
- Request referrals
- Join events
- Request mentorship

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
