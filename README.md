# LiebStore 🛒

A full-stack e-commerce platform built with Next.js, TypeScript, React, PostgreSQL, and Prisma, designed with a focus on modern UI/UX, secure authentication, scalable architecture, and a seamless shopping experience.

The application features product management, search and filtering, shopping cart and checkout flows, user authentication, OAuth providers, reviews, order management, payment integration, email services, and an administrative dashboard.


🔗 Live Demo: https://lieb-store.vercel.app/

![LiebStore](./docs/image/liebstore-img.jpg)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 |
| Frontend | React 19 |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Forms | React Hook Form |
| Validation | Zod |
| Database | PostgreSQL |
| Database Provider | Neon |
| ORM | Prisma |
| Authentication | Auth.js / NextAuth |
| Authentication Methods | Credentials + Google + GitHub + LinkedIn |
| State & Backend Logic | Next.js Server Actions |
| Payments | PayPal + Stripe |
| Email Service | SMTP Gmail |
| Image Upload | Uploadthing |
| Charts | Recharts |
| Testing | Jest |
| Code Quality | ESLint |
| Deployment | Vercel |
| Version Control | Git + GitHub |

## 🚀 Features

### 👤 Authentication and users

- User registration
- Login and logout
- Login with Google
- Login with GitHub
- Login with LinkedIn
- Password recovery via email
- Password change
- Data validation
- Profile management
- Access control

### 🛒 E-commerce

- Product catalog
- Product search
- Filters and categories
- Individual product page
- Quantity selection
- Add to cart
- Cart updates
- Remove products
- Order total calculation
- Checkout
- Order management

## 🚀 Development

This project was originally developed as part of a project-based course. 
After completing the course, I continued improving and customizing the application independently.

### Additional improvements

- Redesigned the application's UI/UX
- Modified and created interface components
- Improved responsive behavior
- Added new authentication flows
- Implemented email verification
- Implemented password recovery
- Added Google, GitHub and LinkedIn authentication
- Improved validation and server-side logic
- Added security-related improvements
- Customized the application architecture and visual design

## 🔐 Security

The application employs various mechanisms to enhance security and protect platform resources.

- User authentication
- Authorization for protected resources
- OAuth for social login
- Data validation with Zod
- Password hashing
- Temporary tokens for password recovery
- Permission control
- Protection of sensitive variables via .env
- Separation of client-side and server-side operations
- Backend data validation

### ⭐ Reviews

- Create reviews
- Display reviews
- User review management
- Data validation

### 🖼️ Image management

- Image upload
- Cloudinary integration
- Product image management

### ⚙️ Administration

- Product management
- User management
- Order management
- Administrative access control

## 🔌 API & Server Actions Reference

The application uses **Next.js Server Actions** to handle server-side operations involving authentication, users, products, cart management, reviews, orders and payments.

> 🔒 Authentication requirements shown below are based on the checks implemented directly inside the corresponding server actions.

---

### 🔐 Authentication

| Action | Description | Access |
|---|---|---|
| `signInWithCredentials` | Authenticates a user using email and password | Public |
| `signUpUser` | Creates a new user account and sends an email verification code | Public |
| `verifyUserEmailAction` | Verifies the user's email using a temporary verification code | Public |
| `signOutUser` | Signs the current user out and removes the cart session cookie | Authenticated |
| `signInWithGoogle` | Starts authentication using Google OAuth | Public |
| `signInWithGithub` | Starts authentication using GitHub OAuth | Public |
| `signInWithLinkedin` | Starts authentication using LinkedIn OAuth | Public |

---

### 🔑 Password Recovery

| Action | Description | Access |
|---|---|---|
| `sendResetCodeAction` | Generates and sends a password recovery code by email | Public |
| `verifyResetCodeAction` | Validates the recovery code and expiration time | Public |
| `resetPasswordAction` | Validates the recovery code and updates the user's password | Public |

---

### 👤 Users

| Action | Description | Access |
|---|---|---|
| `getUserById` | Retrieves a user by ID | Server |
| `updateProfile` | Updates the authenticated user's profile information | Authenticated |
| `updateUserAddress` | Updates the authenticated user's shipping address | Authenticated |
| `updateUserPaymentMethod` | Updates the authenticated user's payment method | Authenticated |
| `getAllUsers` | Retrieves users with pagination and search | Server |
| `updateUser` | Updates a user's name and role | Server |
| `deleteUser` | Removes a user by ID | Server |

---

### 🛍️ Products

| Action | Description | Access |
|---|---|---|
| `getLatestProducts` | Retrieves the latest products | Public |
| `getProductBySlug` | Retrieves a product using its slug | Public |
| `getProductById` | Retrieves a product using its ID | Public |
| `getAllProducts` | Retrieves products with search, pagination, category, price, rating and sorting filters | Public |
| `getAllCategories` | Retrieves all product categories | Public |
| `getFeaturedProducts` | Retrieves featured products | Public |
| `createProduct` | Creates a new product | Server |
| `updateProduct` | Updates an existing product | Server |
| `deleteProduct` | Removes a product by ID | Server |

#### Product filtering

`getAllProducts` supports:

- Search by product name
- Category filtering
- Price range filtering
- Minimum rating filtering
- Pagination
- Sorting by price
- Sorting by rating
- Sorting by creation date

---

### 💳 Payments

| Action | Description | Access |
|---|---|---|
| `createdPaypalOrder` | Creates a PayPal order for an existing order | Server |
| `approvePaypalOrder` | Captures and validates a PayPal payment | Server |
| `updateOrderToPaid` | Marks an order as paid and updates product stock | Server |
| `updateOrderToPaidCOD` | Marks a cash-on-delivery order as paid | Server |

---

### 🛒 Cart

| Action | Description | Access |
|---|---|---|
| `getMyCart` | Retrieves the current user's or guest's cart | Session |
| `addItemToCart` | Adds a product to the cart and validates stock | Session |
| `removeItemFromCart` | Decreases quantity or removes a product from the cart | Session |

#### Cart price calculation

The cart automatically calculates:

- Items subtotal
- Shipping cost
- Tax
- Final total

---

### ⭐ Reviews

| Action | Description | Access |
|---|---|---|
| `createUpdateReview` | Creates or updates a product review | Authenticated |
| `getReviews` | Retrieves all reviews for a product | Public |
| `getreviewByProductId` | Retrieves the authenticated user's review for a product | Authenticated |

When a review is created or updated, the product rating and review count are recalculated.

---

### 📦 Orders

| Action | Description | Access |
|---|---|---|
| `createOrder` | Creates an order from the current cart | Authenticated |
| `getOrderById` | Retrieves an order and its items | Server |
| `getMyOrders` | Retrieves the authenticated user's orders with pagination | Authenticated |
| `getAllOrders` | Retrieves orders with pagination and user search | Server |
| `getOrderSummary` | Retrieves dashboard statistics and sales information | Server |
| `DeleteOrder` | Deletes an order by ID | Server |
| `deliverOrder` | Marks an order as delivered | Server |
| `updateOrderToPaidCOD` | Marks a cash-on-delivery order as paid | Server |

#### Order creation flow

Cart
  │
  ▼
createOrder()
  │
  ├── Validate authentication
  ├── Validate cart
  ├── Validate shipping address
  ├── Validate payment method
  │
  ▼
Create Order
  │
  ▼
Create Order Items
  │
  ▼
Clear Cart
  │
  ▼
Payment

## 🏗️ Project Architecture


The application was organized to separate responsibilities among the interface, business logic, database access, and validation.

src/
├── actions/
│   ├── cart/
│   ├── product/
│   ├── review/
│   ├── Order/
│   ├── Password/
│   └── user/
│
├── app/
│   ├── (auth)/
│   ├── (root)/
│   ├── admin/
│   ├── user/
│   ├── unauthorized/
│   └── api/
│
├── components/
├── email/
├── hooks/
├── prisma/
├── tests/
├── hooks/
├── lib/
├── db/
└── types/

## 🌏 Deploy

The application can be published using services such as:

- Vercel for hosting
- PostgreSQL for database
- Cloudinary for image storage
- SMTP Gmail for sending emails

🔗 Application: https://lieb-store.vercel.app/ 

## 📄 License

This project was developed for educational and portfolio purposes.