# Monolith — Developer Portfolio Dashboard

Monolith is my personal developer portfolio presented as a dashboard application built with Angular.

Throughout my professional experience, I primarily worked on enterprise administration dashboards and mobile applications using Angular and Ionic. Many of those projects were built using the Fuse Angular template, where I learned enterprise project architecture, reusable component design, authentication flows, and responsive layouts.

Monolith built as an enterprise-style dashboard completely from scratch. Rather than extending an existing template, every features, components, layouts, and architecture decisions are implemented manually to demonstrate my understanding of modern Angular development.

This dashboard uses my personal resume and portfolio as its data source instead of mock enterprise data, while simulating a real backend through a local REST API mock. The goal is to showcase my professional experience and also how I develop production-style frontend applications.

> **Obelisk** is the mobile identity used within the application, while **Monolith** is the main project's name.

## Tech Stack

* Angular 19
* TypeScript
* Angular Material
* Tailwind CSS
* RxJS
* Angular Reactive Forms
* Angular Router
* Local JSON mock API

## Features

* Simulated user authentication
* Protected routes using Angular route guards
* Automatic redirection to the originally requested page after login
* Access-token and refresh-token simulation
* HTTP interceptor for authorization headers
* Reusable shared UI components
* Form validation and error handling
* Responsive desktop and mobile layouts
* Developer profile management
* Project showcase
* Skills visualization
* Professional experience timeline

## Project Goals

This project was created to demonstrate:
* Clean and maintainable Angular architecture
* Enterprise-style folder organization
* Reusable standalone components
* REST API integration patterns
* Authentication and route protection
* Responsive UI and UX design

## Screenshots

> Screenshots will be added as development progresses.

## Running Locally

### Checklist

Make sure the following are installed:

* Node.js
* npm
* Angular CLI

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd Monolith
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open the application at:

```text
http://localhost:4200
```

## Mock Authentication

The application uses local JSON data to simulate backend authentication and API responses.
Demo login credentials will be provided once everything is finalized.

## Planned Improvements

* Complete portfolio dashboard
* Improved accessibility for mobile
* Project filtering and search
* Downloadable resume
* Interactive skills charts
* Unit and component testing

## Status

This project is currently under active development.

## Author

Developed by Khairul Izzat bin Roslan, as a personal portfolio and frontend engineering showcase.
