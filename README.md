# 🚀 FastBooker - University Library Seat Booking Simplified

## Background

FastBooker is a custom solution designed to enhance the seat booking experience in university libraries. Developed after reverse-engineering the Affluences API, this project aims to address and improve upon the limitations of the existing system.

## Problem with the Current Affluences System

The Affluences app, used for booking library seats, has several issues:
- **Inefficient Booking Workflow**: It requires booking each 2-hour slot separately for a full day, with a redirection to the home page after each booking.
- **Lack of Seat Number Search**: There's no functionality to search for seats by their numbers, leading to a tedious scrolling process.

## FastBooker Solution

Leveraging the insights from reverse-engineering the Affluences API, FastBooker offers an intuitive and efficient seat booking process. Key features include:
- 📅 **Intuitive Date Selection**: Easily choose dates (Today, Tomorrow, Day After Tomorrow) without the hassle of a complex calendar.
- 🔍 **Seat Number Search**: Find and book seats quickly by their numbers.
- 🕒 **Whole Day Booking**: Conveniently book seats for the entire day, a crucial feature during exam times.

Visit the app here: [FastBooker](https://fastbooker.vercel.app/)

## Getting Started

This project is built with [Next.js](https://nextjs.org/), started with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
