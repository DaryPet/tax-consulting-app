# Project Name: TAX consulting App

## Overview

The **Smart Booking & Document Management System** is a web application that enables users to easily manage documents, book meetings, and interact with the admin. This project is designed with an intuitive user interface, making it suitable for both registered and unregistered users who need to book appointments. The system provides tools for document management, meeting booking with automatic field filling, and administrative access to oversee all operations.

## Features

### 1. User Management

- **Registration and Login**: Users can register to create an account and securely log in. Authentication is done via a standard email and password combination.
- **User Dashboard**: Registered users have their own personal dashboard where they can:
  - **Add Documents**: Upload important documents.
  - **Delete Documents**: Remove documents that are no longer needed.
  - **View Documents**: Review the uploaded documents at any time.

### 2. Meeting Booking System

- **Booking for All**: Both registered and unregistered users can book meetings.
  - **Registered Users**: Automatically have booking fields (such as name and email) pre-filled.
  - **Unregistered Users**: Can manually book a meeting without registration.
- **Calendar Integration**:
  - The calendar is configured to show **working days and hours** only.
  - It checks availability and **prevents double booking** by marking time slots that are already taken as unavailable.
- **Email Confirmation**: After booking a meeting, an email with booking confirmation is sent to the provided email address, ensuring the user has a record of their appointment.

### 3. Admin Features

- **Admin Dashboard**:
  - View **all meetings** scheduled by both registered and unregistered users.
  - Access and manage **all documents** uploaded by registered users.
  - Upload documents for specific registered users to make personalized resources available.
  - to try use username - admin2; password - adminpassword

## Technologies Used

The following technologies were used to create this system:

- **Backend**: Nest.js for building a scalable and modular server-side application.
- **API**: GraphQL for providing a flexible and efficient API for interacting with the backend.
- **Frontend**: React.js for creating a dynamic and responsive user interface.
- **Database**: PostgreSQL for data storage, ensuring that user details, documents, and meeting information are stored securely.
- **Authentication**: JWT (JSON Web Tokens) for handling user authentication and maintaining session security.
- **Calendar Integration**: FullCalendar.js library for managing and displaying booking times.
- **Email Service**: Nodemailer for sending booking confirmation emails to users.

## Getting Started

To get a copy of the project up and running on your local machine for development and testing, follow these steps.

### Prerequisites

- Node.js installed (version 14+ recommended)

### Installation

1. **Clone the repository**:
   ```
   git clone https://github.com/yourusername/smart-booking-system.git
   ```
2. **Navigate to the project directory**:
   ```
   cd smart-booking-system
   ```
3. **Install dependencies for both backend and frontend**:
   ```
   npm install
   cd client
   npm install
   ```
4. **Set up environment variables**:
   Create a `.env` file in the root directory with the following:

   ```

   JWT_SECRET=<Your JWT Secret>
   EMAIL_USER=<Your Email Address>
   EMAIL_PASS=<Your Email Password>
   ```

5. **Run the application**:
   - **Backend**: In the root directory, run:
     ```
     npm run start:dev
     ```
   - **Frontend**: Navigate to the client directory and run:
     ```
     npm start
     ```

### Usage

- **User Registration and Login**: Go to `/register` or `/login` to create an account or log in.
- **Book a Meeting**: Visit the booking page and choose an available time slot.
- **Document Management**: After login, navigate to the dashboard to upload or manage documents.
- **Admin Panel**: Admins can log in to view all documents, meetings, and manage user-specific uploads.

## Future Enhancements

- **Google Calendar Sync**: Allow users to sync their bookings with Google Calendar.
- **Notifications**: Add SMS notifications in addition to email confirmations.
- **Recurring Bookings**: Enable users to set up recurring meetings.

## Contributing

Contributions are welcome! Please create a pull request or open an issue if you have any suggestions or improvements.

## Contact

If you have any questions or need support, feel free to contact the project owner at [d7akkord@gmail.com].
