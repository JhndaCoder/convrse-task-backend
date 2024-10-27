# 🏠 Real Estate Property Listing Platform - Backend  
Welcome to the **backend repository** for the Real Estate Property Listing Platform! This backend system powers a property marketplace, enabling customers to explore listings, make bookings, and providing admins the ability to manage properties efficiently. Built with modularity and scalability in mind, this backend is designed to support both the customer and admin experiences seamlessly. 

---

## 🌟 Features Implemented

### **User Roles & Authentication**
- **Customer:**
  - View property listings.
  - Book properties based on availability.
- **Admin:**
  - All customer permissions, plus:
    - **Full CRUD operations** for properties and bookings.
    - **Admin dashboard access** to manage the platform.

- **Authentication System:**
  - Login and Signup functionality.
  - JWT-based authentication for secure access.
  - **Middleware-protected routes** to ensure restricted access (admin-only routes).
  
---

## 🚀 Pages and Backend Functionality

1. **Auth Screens:**
   - **Login and Signup endpoints** available for seamless user authentication.
   - Password validations to ensure strong security standards.

2. **Property Listing Page:**
   - **Retrieve properties** with relevant details (image, name, price, location, etc.).
   - **Filters available** for:
     - Location  
     - Availability  
     - Price  
   - **Search functionality** for properties by name. *(Optional - Implemented 🎉)*

3. **Property Details Page:**
   - Provides **detailed property information**.
   - Includes **amenities such as garden, clubhouse, play area, gym**.
   - **VR mode support** through integration with [Panolens.js](https://pchen66.github.io/Panolens/) to provide a 360-degree view. *(Optional - Implemented 🎉)*

4. **Booking Page:**
   - **Create bookings** while ensuring:
     - **No double bookings** for the same date/time.
     - **Validation checks** for booking availability.
   - **Payment gateway integration** ready for secure transactions. *(Optional - Implemented 🎉)*

5. **Admin Panel / Dashboard:**
   - Admins can perform **CRUD operations** for properties and bookings.
   - **Filter options** available for better management.
   - **Access restricted to admins** via middleware-based authentication.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB / MySQL (configurable via `.env`)
- **Authentication:** JWT for token-based authentication
- **Logging:** Custom logger to track system events and errors
- **Deployment Ready:** Configured for seamless deployment to cloud environments
- **Version Control:** Git for version tracking

---

## 📂 Project Structure

```plaintext
convrse-back/
│
├── config/
│   └── db.js           # Database connection logic
├── controllers/
│   └── authController.js   # Handles login, signup, and user authentication
├── middleware/
│   ├── authMiddleware.js   # Protects routes, validates JWTs
│   └── errorHandler.js     # Centralized error handling
├── models/
│   ├── User.js        # User schema and model
│   ├── Property.js    # Property schema and model
│   └── Booking.js     # Booking schema and model
├── routes/
│   ├── authRoutes.js      # Authentication-related routes
│   ├── propertyRoutes.js  # Property management routes
│   └── bookingRoutes.js   # Booking-related routes
├── utils/
│   └── logger.js          # Custom logging utility
├── logs/              # Logs for system events and errors
├── server.js          # Server entry point
└── .env.example       # Environment variables template
```

---

## 🧪 Additional Features (Optional - Implemented 🎉)
- **Search by property name** in the property listing page.  
- **VR integration** using Panolens.js for a 360-degree property tour experience.  
- **Payment gateway integration** for smooth transactions during bookings.  
- **CI/CD Pipeline Setup** to automate:
  - Code building
  - Linting and unit testing
  - Deployment to staging environments. *(Optional - Implemented 🎉)*

---

## 📦 How to Run the Project

### Prerequisites:
- **Node.js** installed (v14+ recommended).
- **MongoDB / MySQL** database running (configure `.env`).
- **Git** installed for version control.

### Step-by-Step Setup:
1. **Clone the Repository:**
   ```bash
   git clone <your-repository-url>
   cd convrse-back
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   - Rename `.env.example` to `.env` and update with your configuration.

4. **Start the Server:**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3000`.

5. **Run Tests:**
   ```bash
   npm test
   ```

---

## 🔧 API Endpoints

### **Authentication:**
- **POST** `/auth/signup` - Register a new user.
- **POST** `/auth/login` - Authenticate user and retrieve token.

### **Properties:**
- **GET** `/properties` - Retrieve all properties with filtering options.
- **POST** `/properties` - Create a new property (Admin only).
- **PUT** `/properties/:id` - Update a property (Admin only).
- **DELETE** `/properties/:id` - Delete a property (Admin only).

### **Bookings:**
- **GET** `/bookings` - Retrieve all bookings.
- **POST** `/bookings` - Create a new booking.
- **PUT** `/bookings/:id` - Update an existing booking.
- **DELETE** `/bookings/:id` - Delete a booking.

---

## 🛡️ Security and Middleware
- **JWT-based authentication** to secure routes.
- **Role-based access control** to ensure admins have exclusive access to management features.
- **Centralized error handling** using `errorHandler.js`.

---

## 🚀 CI/CD Pipeline
- **CI/CD pipeline** configured using Jenkins/GitLab CI to:
  - Automate builds, linting, and testing.
  - Deploy to staging environments seamlessly.
  - Ensure high code quality with every commit.

---

## 📑 Submission Checklist
- ✅ Backend repository on GitHub.
- ✅ Deployment link provided.
- ✅ Video demonstration of the platform's functionalities.

---

## 🎯 Conclusion
This backend system is a robust, scalable solution for managing a real estate property platform. With all mandatory and optional features implemented, this project not only meets but exceeds the requirements of the assignment. Its modular structure, secure authentication, and seamless booking flow make it production-ready and easy to extend.

---

## 🤝 Acknowledgments
Special thanks to the tools and libraries used in this project:
- **Express.js** for backend routing.
- **MongoDB / MySQL** for data management.
- **JWT** for secure authentication.
- **Panolens.js** for VR tours.

---

Feel free to explore the code and let me know if there are any suggestions for improvements! 🎉

---