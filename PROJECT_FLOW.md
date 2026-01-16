# Project Data Flow & Architecture

This document visualizes how data flows through the application, focusing on the User Authentication and Property Management lifecycles.

## 1. High-Level Architecture

The project follows a modern Client-Server architecture:

```mermaid
graph TD
    User((User))
    
    subgraph Frontend [React Frontend]
        UI[Pages & Components]
        State[React State & Context]
        Axios[Axios API Client]
    end
    
    subgraph Backend [FastAPI Backend]
        API[API Routers]
        Auth[Security & Auth]
        Models[SQLModel Schemas]
    end
    
    subgraph Database [Data Layer]
        DB[(SQLite/MySQL DB)]
    end
    
    subgraph External [External Services]
        Google[Google OAuth]
    end

    User <-->|Interacts| UI
    UI <-->|Updates| State
    State <-->|Requests| Axios
    
    Axios <-->|JSON / HTTP| API
    
    API -->|Validates| Auth
    API <-->|Queries| Models
    Models <-->|Reads/Writes| DB
    
    Auth <-->|Verifies Token| Google
```

## 2. Google Authentication & Role Selection Flow

This specific flow diagrams how a user logs in with Google and how new users are handled.

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant BE as Backend (FastAPI)
    participant G as Google Auth
    participant DB as Database

    User->>FE: Click "Sign in with Google"
    FE->>G: Request Access
    G-->>FE: Return ID Token
    
    FE->>BE: POST /auth/google (token)
    BE->>G: Verify Token
    G-->>BE: Token Valid + User Info
    
    BE->>DB: Check if Email Exists
    
    alt New User
        BE->>DB: Create User (Role = VISITOR)
        DB-->>BE: User Saved
        BE-->>FE: Return JWT + User (Role: VISITOR)
        FE->>FE: Check Role == VISITOR
        FE->>User: Redirect to /role-selection
        
        User->>FE: Select Role (e.g., Buyer)
        FE->>BE: PUT /auth/role (role=Buyer)
        BE->>DB: Update User Role
        BE-->>FE: Role Updated
        FE->>User: Redirect Home
    else Existing User
        BE-->>FE: Return JWT + User (Role: Buyer/Agent/etc)
        FE->>FE: Check Role != VISITOR
        FE->>User: Redirect Home
    end
```

## 3. Key Components Breakdown

### Frontend (Client Side)
*   **Pages**: `Login.jsx`, `Register.jsx`, `RoleSelection.jsx`, `Home.jsx`, `Properties.jsx`.
*   **Logic**: 
    *   Uses `axios` to communicate with the backend `http://localhost:8000`.
    *   Stores `token` and `role` in `localStorage` for simplified session management.
    *   `App.jsx` handles routing and page navigation.

### Backend (Server Side)
*   **Main**: `main.py` initializes the FastAPI app and includes routers.
*   **Routers** (`app/routers/`):
    *   `auth.py`: key endpoints for login (`/login`, `/google`) and role updates (`/role`).
    *   `properties.py`: Handles listing, searching, and viewing properties.
*   **Database**:
    *   `database.py`: Manages the connection session.
    *   `models.py`: Defines the table structures (`User`, `Property`, `Inquiry`, etc.).
    *   Uses **SQLModel** (wrapper around SQLAlchemy) for ORM features.

