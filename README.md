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

### ⭐ Reviews

- Create reviews
- Display reviews
- User review management
- Data validation

### 🖼️ Image management

- Image upload
- UploadThing integration
- Product image management

### ⚙️ Administration

- Product management
- User management
- Order management
- Administrative access control

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

The application implements several mechanisms to protect user accounts, application data, and sensitive operations.

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

## 🔑 Password Recovery

The application implements a password recovery flow using temporary verification codes, token expiration, database persistence, server-side validation, and password hashing.

### 🔄 Recovery Flow

```text
User enters email
       │
       ▼
sendResetCodeAction()
       │
       ├── Validate email with Zod
       ├── Check if user exists
       ├── Generate reset code
       ├── Hash verification code
       ├── Store hash + expiration
       └── Send code by email
       │
       ▼
verifyResetCodeAction()
       │
       ├── Validate code
       ├── Hash submitted code
       ├── Compare with stored hash
       └── Check expiration
       │
       ▼
resetPasswordAction()
       │
       ├── Validate email, code and password
       ├── Validate reset token
       ├── Hash new password
       ├── Update user password
       └── Delete used reset token
```

### 🛡️ Security Features

- Email validation with Zod
- Temporary verification codes
- Hashed reset codes stored in the database
- Token expiration
- Invalid or expired codes are rejected
- Passwords are hashed before being stored
- Reset tokens are deleted after successful password recovery
- Generic response when the requested account does not exist

### 💻 Server-side Implementation

A temporary verification code is generated and hashed before being stored:

```ts
const code = generateResetCode();
const tokenHash = hashResetCode(code);
const expiresAt = getResetCodeExpiration();

await prisma.passwordResetTokenUser.create({
  data: {
    email: validation.data.email,
    tokenHash,
    expiresAt,
  },
});

await sendPasswordResetEmail(
  validation.data.email,
  code
);
```

During verification, the submitted code is hashed again and compared with the stored token:

```ts
const tokenHash = hashResetCode(code);

const tokenRecord =
  await prisma.passwordResetTokenUser.findFirst({
    where: {
      email,
      tokenHash,
    },
  });

if (!tokenRecord) {
  return {
    success: false,
    message: "Invalid reset code",
  };
}

if (tokenRecord.expiresAt < new Date()) {
  return {
    success: false,
    message: "Code has expired. Please request a new one.",
  };
}
```

After successful validation, the new password is hashed before being stored:

```ts
const hashedPassword = await hash(validation.password);

await prisma.user.update({
  where: {
    email: validation.email,
  },
  data: {
    password: hashedPassword,
  },
});
```

After the password is updated, the reset token is deleted:

```ts
await prisma.passwordResetTokenUser.deleteMany({
  where: {
    email: validation.email,
  },
});
```

## 💳 PayPal Integration

The application integrates the **PayPal REST API** to process online payments through a server-side payment flow.

The integration uses **OAuth 2.0** to authenticate with PayPal, creates checkout orders, captures payments, and validates API responses before updating the application state.

### 🔄 Payment Flow

```text
User Checkout
      │
      ▼
createdPaypalOrder()
      │
      ├── Generate PayPal access token
      ├── Create PayPal order
      └── Store PayPal order ID
      │
      ▼
PayPal Checkout
      │
      ▼
approvePaypalOrder()
      │
      ├── Capture payment
      ├── Validate payment response
      └── Verify payment status
      │
      ▼
updateOrderToPaid()
      │
      ├── Mark order as paid
      ├── Update payment result
      ├── Decrease product stock
      └── Send purchase receipt
```

### 🔐 OAuth 2.0 Authentication

The application generates a PayPal access token using the `client_credentials` grant:

```ts
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

const auth = Buffer.from(
  `${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`
).toString("base64");

const response = await fetch(
  `${base}/v1/oauth2/token`,
  {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
  }
);

const jsonData = await handleResponse(response);

return jsonData.access_token;
```

The PayPal credentials are kept in environment variables instead of being exposed to the client.

### 🛒 Creating a PayPal Order

A server-side request is made to the PayPal Checkout Orders API:

```ts
const accessToken = await generateAccessToken();

const response = await fetch(
  `${base}/v2/checkout/orders`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price,
          },
        },
      ],
    }),
  }
);
```

The generated PayPal order ID is then associated with the corresponding application order.

### 💰 Capturing the Payment

After the customer completes the PayPal checkout, the application captures the payment using the PayPal order ID:

```ts
const accessToken = await generateAccessToken();

const response = await fetch(
  `${base}/v2/checkout/orders/${orderId}/capture`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
```

The response is validated before the application considers the payment successful.

### 🛡️ Server-side Payment Validation

The payment flow validates:

- PayPal order existence
- PayPal payment response
- PayPal order ID
- Payment status
- Payment capture result

After successful validation, the application updates the order and product inventory.

### 🗄️ Database Transaction

The order status and product stock are updated inside a Prisma transaction:

```ts
await prisma.$transaction(async (tx) => {
  for (const item of order.OrderItem) {
    await tx.product.update({
      where: {
        id: item.productId,
      },
      data: {
        stock: {
          increment: -item.qty,
        },
      },
    });
  }

  await tx.order.update({
    where: {
      id: orderId,
    },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult,
    },
  });
});
```

This keeps the payment status and inventory updates synchronized.

### 🌐 PayPal Environment

The integration uses the **PayPal Sandbox environment** by default:

```ts
const base =
  process.env.PAYPAL_API_URL ||
  "https://api-m.sandbox.paypal.com";
```

The API URL can be configured through the `PAYPAL_API_URL` environment variable.

### 🧩 Technologies Used

- PayPal REST API
- OAuth 2.0
- Next.js Server Actions
- TypeScript
- Fetch API
- Prisma ORM
- PostgreSQL

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

```text
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
```

## 🏗️ Project Architecture

The application was organized to separate responsibilities among the interface, business logic, database access, and validation.

```text

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
├── lib/
├── db/
└── types/
```

## 🌏 Deploy

The application can be published using services such as:

- Vercel for hosting
- PostgreSQL for database
- Cloudinary for image storage
- SMTP Gmail for sending emails

🔗 Application: https://lieb-store.vercel.app/ 

## 📄 License

This project was developed for educational and portfolio purposes.