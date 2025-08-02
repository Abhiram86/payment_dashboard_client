# 💻 Payment Dashboard – Backend API (NestJS)

This backend powers the Payment Dashboard App. Built with NestJS, it handles authentication and user-based payment management.

---

## ✅ Base URL

```
http://<your-server-domain>/api
```

---

## 🔐 Authentication

- Use JWT token-based auth
- Token is returned on login and must be included in headers:

```http
Authorization: Bearer <token>
```

---

## 📦 Endpoints

### 🔸 POST `/auth/register`

Register a new user.

#### Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123",
  "token": "jwt_token_here"
}
```

#### Response

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

---

### 🔸 POST `/auth/login`

Login and receive a JWT token.

#### Body

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Response

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

---

Here's a clear and concise **Markdown spec** based on your request — perfect for documenting or planning your **React Native (Expo) app UI** using tab navigation, authentication flow, and context API.

---

# 📱 Mobile App UI (Expo + React Navigation + Context)

This document describes how to build a mobile app with tab navigation and authentication using React Navigation, Expo Secure Store, and Context API.

---

## 🔐 Authentication Flow

- Use a **layout screen** called `AuthLayout` for both `Login` and `Register` screens.
- Show **only** `Login` and `Register` if the user is not authenticated.
- Once logged in, show the **Tabs** (`Payments`, `Stats`).

---

## 🧭 Navigation Structure

```
App
│
├── AuthLayout (Stack)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainTabs (Tabs)
    ├── PaymentsScreen
    └── StatsScreen
```

---

## 🏷 Tabs (Visible Only When Logged In)

- `Payments`: Shows a list of transactions from `/payments`.
- `Stats`: Shows analytics from `/payments/stats`.

✅ Only shown if the user has a valid JWT token.

---

## 🔑 Login Screen

### Fields:

- `email`
- `password`

### Buttons:

- `Login`
- Text link: `Don't have an account? Register`

### Behavior:

- On success:

  - Store JWT token in `SecureStore`
  - Store user info (excluding password) in Context

---

## 🧾 Register Screen

### Fields:

- `username`
- `email`
- `password`

### Buttons:

- `Register`
- Text link: `Already have an account? Login`

### Behavior:

- On success:

  - Same as login: store token in `SecureStore`, user in context

---

## 💾 Secure Token Storage

Use `expo-secure-store`:

```ts
import * as SecureStore from "expo-secure-store";

await SecureStore.setItemAsync("token", token);
```

---

## 🧠 Context API (UserContext)

Create a `UserContext` to manage:

### 🔸 State

```ts
{
  user: {
    id: number;
    email: string;
    username: string;
  } | null;
}
```

### 🔸 Methods

```ts
{
  login(user, token);
  logout();
}
```

---

## ✅ Flow Summary

| State      | Shown UI              |
| ---------- | --------------------- |
| Logged out | Login / Register only |
| Logged in  | Payments / Stats tabs |

---
