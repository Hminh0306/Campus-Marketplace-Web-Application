# Campus-Marketplace-Web-Application

 Campus Marketplace allows Macquarie University students to browse marketplace listings, view their own listings, and manage a personal shortlist using Firebase Authentication and Firestore Database.


## Features

### Authentication

* Firebase Authentication login
* Sign out functionality
* Access control for protected pages
* Automatic redirection to login page when unauthenticated

### Marketplace

* Loads items dynamically from Firestore
* Displays item image, name, description, category, price/trade status, and seller email
* Excludes items listed by the currently signed-in user
* Allows users to shortlist items

### My Listings

* Displays only listings created by the signed-in user
* Filters data using the user's Firebase UID

### My Shortlist

* Displays shortlisted items for the current user
* Allows users to remove items from their shortlist
* Stores shortlist data in Firestore

---

## Technologies Used

* HTML5
* CSS3
* Bootstrap 5
* JavaScript (ES6 Modules)
* Firebase Authentication
* Firebase Firestore
* Visual Studio Code
* Live Server

---

## Project Structure

```text
project/
│
├── login.html
├── index.html
├── marketplace.html
├── mylistings.html
├── shortlist.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── marketplace.js
│   ├── mylistings.js
│   └── shortlist.js
│
├── images/
│   ├── item1.jpg
│   ├── item2.jpg
│   ├── item3.jpg
│   └── placeholder.png
│
└── README.txt
```

---

## How to Run Locally

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click on `login.html`.
4. Select **Open with Live Server**.
5. Sign in using one of the test accounts listed below.

---

## Firebase Configuration

Firebase configuration is located in:

```text
js/firebase.js
```

Firebase Project Name:

```text
Campus-Marketplace
```

Firebase Config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyATr3nykFWbz80ZSJdTAiykhmk4MJSse4Y",
  authDomain: "campus-bd130.firebaseapp.com",
  projectId: "campus-bd130",
  storageBucket: "campus-bd130.firebasestorage.app",
  messagingSenderId: "360523767817",
  appId: "1:360523767817:web:0422f53ea05ad1d65498d8"
};
```

---

## Authentication Flow

1. User enters email and password on the login page.
2. Firebase Authentication verifies credentials.
3. Upon successful login, the user is redirected to the Welcome Page.
4. Protected pages use `onAuthStateChanged()` to verify authentication.
5. Unauthenticated users are redirected to `login.html`.
6. Clicking Sign Out terminates the session and returns the user to the login page.

---

## Firestore Collections

### items

Stores marketplace listings.

Fields:

* itemName
* description
* category
* price
* image
* sellerEmail
* sellerUID

### shortlists

Stores user shortlist data.

Fields:

* userId
* itemId

---

## Test User Credentials

### Test User 1

Email:

```text
user1@student.com
```

Password:

```text
Password123
```

### Test User 2

Email:

```text
user2@student.com
```

Password:

```text
Password123
```

### Test User 3

Email:

```text
user3@student.com
```

Password:

```text
Password123
```

### Test User 4

Email:

```text
user4@student.com
```

Password:

```text
nothing123
```

 
### Test User 5

Email:

```text
user5@student.com
```

Password:

```text
studentatmacquarie
```
---


## Future Improvements

* User registration page
* Add new listings through the web interface
* Edit and delete listings
* Firebase Storage image uploads
* Buyer and seller messaging
* Advanced filtering and search
* User profiles and ratings

---

