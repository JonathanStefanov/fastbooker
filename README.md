# 🚀 FastBooker - University Library Seat Booking Simplified

## ⚠️ Important Legal Notice

**This is an UNOFFICIAL, independent project not affiliated with Affluences.**

**USE AT YOUR OWN RISK:** This tool may violate Affluences' Terms of Service. Your account could be suspended. This service may stop working at any time. [Read full disclaimer](DISCLAIMER.md)

**Educational Purpose:** This project demonstrates API integration and UX improvements for learning purposes.

---

## Background

FastBooker is a custom solution designed to enhance the seat booking experience in university libraries. Developed after reverse-engineering the Affluences API, this project aims to address and improve upon the limitations of the existing system.

## Multi-University Support

FastBooker supports multiple universities! Currently configured:

| University | Short Name | Email Domain |
|---|---|---|
| Université Libre de Bruxelles | ULB | `ulb.be` |
| Università degli Studi di Padova | UniPD | `unipd.it` |

Adding a new university is as simple as adding an entry to `lib/universities.js` with the search query, email domain, and brand colors.

## Problem with the Current Affluences System

The Affluences app, used for booking library seats, has several issues:
- **Inefficient Booking Workflow**: It requires booking each 2-hour slot separately for a full day, with a redirection to the home page after each booking.
- **Lack of Seat Number Search**: There's no functionality to search for seats by their numbers, leading to a tedious scrolling process.

## FastBooker Solution

Leveraging the insights from reverse-engineering the Affluences API, FastBooker offers an intuitive and efficient seat booking process. Key features include:
- 🏫 **Multi-University**: Switch between universities from the home page
- 📅 **Intuitive Date Selection**: Easily choose dates (today + next 6 days) with a clean circular picker
- 🔍 **Seat Number Search**: Find and book seats quickly by their numbers
- 🕒 **Whole Day Booking**: Conveniently book seats for the entire day, a crucial feature during exam times
- 👁️ **View All Seats**: See all available seats across all rooms in a single view, especially useful when libraries are heavily booked
- 📊 **Occupancy & Status**: See library open/closed status, occupancy percentage, and seat counts at a glance

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
```

## ⚠️ Legal & Ethical Considerations

### Legal Notice
This project accesses the Affluences API without official authorization. Please read the [full disclaimer](DISCLAIMER.md) before using.

### Ethical Use
- Don't abuse the API with excessive requests
- Respect Affluences' infrastructure and other users
- Use responsibly and consider supporting the official app
- This is for personal, educational use only

### Contact
If you represent Affluences and have concerns, please open an issue. We will respond promptly.

## License

MIT License with disclaimer - see [LICENSE](LICENSE) file for details.
