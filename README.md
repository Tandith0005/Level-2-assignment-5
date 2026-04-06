
# 🎨 Planora Frontend

> **A modern, responsive, and type-safe user interface for the Planora Event Management Platform.**

Built with **Next.js 14+ (App Router)**, **TypeScript**, and **Tailwind CSS**, this frontend provides a seamless experience for discovering events, managing registrations, and handling secure payments via Stripe. It leverages **TanStack Query** for efficient data fetching and **Zod** + **React Hook Form** for robust form validation.

## Live URLs
- **Github Backend** : https://github.com/Tandith0005/Planora-Server
- **Frontend**: https://level-2-assignment-5-637q.onrender.com
- **Backend API**: https://level-2-assignment-5-server.onrender.com

## ✨ Key Features

### 🏠 Public Pages
*   **Hero & Discovery:** Engaging homepage with featured events and category filtering.
*   **Event Listing:** Advanced search, filtering (Public/Private, Free/Paid), and pagination.
*   **Event Details:** Comprehensive event info with dynamic action buttons (Join, Pay, Request).
*   **Auth Pages:** Secure Login, Register, and Email Verification flows with real-time validation.

### 🛡️ User Dashboard
*   **Overview:** Personal stats and quick actions.
*   **My Events:** Create, edit, and delete events. Manage participant lists (Approve/Reject/Ban).
*   **Invitations:** Accept or decline private event invites.
*   **Profile:** Update user details and view history.
*   **Notifications:** Real-time updates on event status and invitations.

### 💳 Payment Integration
*   **Stripe Checkout:** Seamless redirect to Stripe for paid events.
*   **Payment Status:** Dedicated Success/Cancel pages with automatic cache invalidation.
*   **Token Refresh:** Automatic JWT token rotation using Axios interceptors and LocalStorage fallback.

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14+ (App Router), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **State & Data** | TanStack Query (React Query), Axios |
| **Forms** | React Hook Form, Zod |
| **Auth** | JWT (LocalStorage + HttpOnly Cookie hybrid) |
| **Payments** | Stripe Checkout (Client-side redirect) |
| **Deployment** | Render (Web Service) |

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Backend API running (see [Backend Repo](#))

### Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/Tandith0005/Level-2-assignment-5-frontend.git
    cd Level-2-assignment-5-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
src/
├── app/                   
│   ├── (auth)/           
│   ├── (dashboard)/      
│   ├── events/           
│   └── layout.tsx        
├── components/           
│   ├── common/           
│   ├── event/            
│   ├── homepage/         
│   └── layout/        
├── hooks/                 
├── lib/             
├── services/             
├── types/               
├── providers/               
└── proxy.ts   
```         

## 🎨 Design System
- Theme: Dark mode default (#0a0a0f background) with Violet/Indigo accents.
- Responsiveness: Mobile-first design using Tailwind breakpoints.
- Feedback: Toast notifications via react-hot-toast for all user actions.
