# 🚀 FastBooker - University Library Seat Booking Simplified

## Background

FastBooker is a custom solution to improve the seat booking experience in our university library. It was created after reverse-engineering the Affluences API, allowing for a deeper understanding of its functionalities and limitations. This knowledge was instrumental in developing an application that not only resolves the issues of the Affluences system but also enhances the overall user experience.

## Problem with the Current Affluences System

The Affluences app, currently used for booking library seats, presents several challenges:
- **Inefficient Booking Workflow**: Requires booking each 2-hour slot separately for the full day, redirecting to the home page after each booking.
- **No Seat Number Search**: Lacks the ability to search for seats by their number, leading to a time-consuming process.

## FastBooker Solution

Utilizing insights from the reverse-engineered Affluences API, FastBooker offers a streamlined and user-friendly booking process. Key features include:
- 📅 **Intuitive Date Selection**: Select dates easily (Today, Tomorrow, Day After Tomorrow) without complex calendar navigation.
- 🔍 **Seat Number Search**: Quickly locate and book seats by their numbers.
- 🕒 **Whole Day Booking**: Book seats for the entire day effortlessly, an essential feature for exam preparations.

## Getting Started

This project is built with [Next.js](https://nextjs.org/), initiated using [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev

```