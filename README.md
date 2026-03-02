# GESTate - Premium Estate Management System

GESTate is a high-end gate pass and estate management solution designed to streamline visitor access, enhance security, and provide a premium experience for residents and administrators.

## 🚀 Key Features

### 🛡️ Security & Authentication
- **JWT-Based Authentication**: Secure, stateless user sessions using JSON Web Tokens.
- **Role-Based Access Control (RBAC)**: Distinct permissions and user interfaces for **Admins**, **Residents**, and **Security Guards**.
- **Secure Password Hashing**: BCrypt encryption for all user credentials.

### 🏠 Resident Features
- **OTP Generation**: Instantly generate 6-digit secure codes for expected visitors with a localized pulse-effect UI.
- **Exit Pass Generation**: Issue digital checkout passes for departing guests.
- **Self-Service Registration**: Easy signup for new residents with apartment-linking logic (subject to Admin approval).

### 👮 Security Guard Features
- **Live OTP Verification**: Real-time validation of visitor codes against the estate database.
- **Digital Visiting Logs**: Automated recording of check-in times and entrance logs.
- **Entrance Management**: Unified dashboard for processing visitors efficiently.

### ⚙️ Admin Features
- **User Management**: Approve resident signups and create dedicated security guard accounts.
- **Unit Management**: Register and organize apartments, blocks, and streets within the estate.
- **Audit Trails**: Access to comprehensive visiting logs for the entire community.

### 🎨 Design & Experience
- **Premium Aesthetics**: Modern UI featuring dark mode, glassmorphism, and smooth gradients.
- **Responsive Navbar**: Context-aware navigation that adapts to the user's role and device.
- **Real-time State Management**: Powered by Redux Toolkit for a seamless, fast user experience.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, CSS Modules.
- **Backend**: Spring Boot 3.x, Spring Security, Java 17.
- **Database**: MongoDB.
- **Auth**: JJWT (Java JWT).

---

## 🔮 Future Roadmap (Robustness Suggestions)

To make GESTate even more robust, we suggest the following future enhancements:

### 1. Advanced Security
- **QR Code Verification**: Instead of typed OTPs, residents can send QR codes for security to scan at the gate.
- **ID/Image Capture**: Integration for security to capture and store photos of visitors or their government IDs during check-in.
- **Blacklist & Alert System**: Ability to flag specific individuals and notify security instantly if they attempt entry.

### 2. Communication & Automation
- **Real-time Notifications**: Push notifications (via Firebase or Socket.io) to alert residents when a visitor arrives or when their OTP is verified.
- **Scheduled Visits**: Allow residents to pre-register visitors for specific dates and times.
- **Delivery/Service Flow**: Dedicated workflows for maintenance personnel and delivery drivers (e.g., Jumia, DHL).

### 3. Utility & Analytics
- **Emergency Button**: A "Panic" feature for residents to alert all security personnel and neighbors in case of an emergency.
- **Admin Analytics**: Data visualization dashboard showing peak visitor hours, duration of stay trends, and security performance metrics.
- **In-App Messaging**: Encrypted chat between residents and the security gate for quick communication.

### 4. Enterprise Features
- **Multi-Estate Support**: A multi-tenant architecture to manage multiple gated communities through a single platform.
- **Biometric Login**: Support for FaceID/TouchID on mobile devices for faster, more secure access.

---

## 🏗️ Getting Started

### Prerequisites
- Node.js & npm
- JDK 17+
- MongoDB

### Installation
1.  **Backend**: Run `./start_backend.ps1` or `mvn spring-boot:run` in the `Estate` directory.
2.  **Frontend**: Run `npm install` followed by `npm run dev` in the `GatePassApp` directory.
3.  **Environment**: Ensure `.env` files are configured with your local MongoDB URI and API Base URL.
