# Innflux Landing Page

Welcome to the official landing page for **Innflux – The World's First Composable Credit Layer**.

## Overview
This repository contains the source code for the Innflux landing page, designed to introduce our platform and collect early access requests from interested users and institutions.

## Features
- **Modern Responsive UI**: Fully responsive design for desktop and mobile devices.
- **How it Works Section**: Interactive step-by-step protocol flow with smooth animations.
- **Early Access Form**: Collects user information and stores it securely in a Supabase Postgres database.
- **Supabase Integration**: All form submissions are saved directly to the `early_access` table in Supabase.
- **User-Friendly Feedback**: Success toast notification and improved validation for a seamless user experience.

## Tech Stack
- HTML5, CSS3 (custom, no framework)
- JavaScript (Vanilla)
- [Supabase](https://supabase.com/) (Postgres DB, REST API)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/innflux-v3-landing.git
cd innflux-v3-landing
```

### 2. Install Dependencies
No build tools required. All dependencies are loaded via CDN.

### 3. Supabase Setup
- Create a [Supabase](https://supabase.com) project.
- Create a table named `early_access` with the following columns:
  - `id` (bigserial, primary key)
  - `name` (text)
  - `email` (text)
  - `telegram` (text)
  - `x` (text)
  - `message` (text)
  - `created_at` (timestamp, default: now())
- Enable Row Level Security (RLS) and add this policy:
  ```sql
  create policy "Allow insert for all" on early_access
    for insert
    with check (true);
  ```
- Update your `index.html` with your Supabase project URL and anon public key.

### 4. Run Locally
Simply open `index.html` in your browser.

## Customization
- **Branding**: Replace logo and images in the `/img` directory as needed.
- **Form Fields**: Adjust form fields and Supabase schema as your use case evolves.

## Folder Structure
```
innflux-v3-landing/
├── index.html
├── style.css
├── README.md
├── ...
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

---

**Innflux** – Bridging DeFi and TradFi with composable, real-world credit solutions. 