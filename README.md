# 🚀 FastBooker — University Library Seat Booking Simplified

## ⚠️ Important Legal Notice

**This is an UNOFFICIAL, independent project not affiliated with Affluences.**

**USE AT YOUR OWN RISK:** This tool may violate Affluences' Terms of Service. Your account could be suspended. This service may stop working at any time. [Read full disclaimer](DISCLAIMER.md)

**Educational Purpose:** This project demonstrates API integration and UX improvements for learning purposes.

---

## Background

FastBooker is a custom solution designed to enhance the seat booking experience in university libraries. Developed after reverse-engineering the Affluences API, this project aims to address and improve upon the limitations of the existing system.

## Features

- 🌍 **Internationalization** — Full i18n support (English, Italian, French) with automatic locale detection
- 🏫 **Multi-University** — 20+ universities across 7 countries, with a selection modal on first visit
- 📅 **Intuitive Date Selection** — Choose dates (today + next 6 days) with localized day names
- 🔍 **Seat Number Search** — Find and book seats quickly by their numbers
- 🕒 **Whole Day Booking** — Book seats for the entire day — crucial during exam times
- ⏱️ **Multi-Slot Selection** — Tap to toggle, swipe to select ranges, auto-group contiguous slots
- 👁️ **View All Seats** — See all available seats across all rooms in a single view
- ⭐ **Favorite Seats** — Heart-icon to bookmark seats, favorites sorted to top, "Favorites only" filter toggle. Stored locally in browser.
- 📊 **Occupancy & Status** — Library open/closed status, occupancy percentage, and seat counts
- 💾 **Persistent Settings** — University and email saved in browser storage

## Supported Universities

FastBooker supports 20+ universities from the Affluences platform:

### 🇧🇪 Belgium
| University | Short Name | Email Domain |
|---|---|---|
| Université Libre de Bruxelles | ULB | `ulb.be` |
| UCLouvain | UCLouvain | `uclouvain.be` |
| Université de Namur | UNamur | `unamur.be` |
| Vrije Universiteit Brussel | VUB | `vub.be` |
| Universiteit Gent | UGent | `ugent.be` |

### 🇨🇭 Switzerland
| University | Short Name | Email Domain |
|---|---|---|
| Université de Lausanne | UNIL | `unil.ch` |
| Université de Genève | UNIGE | `unige.ch` |
| EPFL | EPFL | `epfl.ch` |
| Université de Fribourg | UNIFR | `unifr.ch` |

### 🇫🇷 France
| University | Short Name | Email Domain |
|---|---|---|
| Université de Caen Normandie | UNICAEN | `unicaen.fr` |
| Université Bretagne Sud | UBS | `univ-ubs.fr` |
| Université Catholique de l'Ouest | UCO | `uco.fr` |
| Université de Perpignan | UPVD | `univ-perp.fr` |
| Université Gustave Eiffel | UGE | `univ-eiffel.fr` |
| Université de Nîmes | UNîMES | `unimes.fr` |
| Université Marie et Louis Pasteur | UMLP | `univ-fcomte.fr` |
| Université d'Évry | UEVE | `univ-evry.fr` |

### 🇮🇹 Italy
| University | Short Name | Email Domain |
|---|---|---|
| Università degli Studi di Padova | UniPD | `unipd.it` |
| Università di Bologna | UniBo | `unibo.it` |
| Università Cattolica del Sacro Cuore | UCSC | `unicatt.it` |
| Università Bicocca | UniMiB | `unimib.it` |
| Università di Pavia | UniPV | `unipv.it` |
| Università di Macerata | UNIMC | `unimc.it` |
| Università di Napoli Federico II | UniNa | `unina.it` |

### 🇱🇺 Luxembourg
| University | Short Name | Email Domain |
|---|---|---|
| University of Luxembourg | Uni.lu | `uni.lu` |

### 🇩🇪 Germany
| University | Short Name | Email Domain |
|---|---|---|
| Bergische Universität Wuppertal | BUW | `uni-wuppertal.de` |

### 🇪🇸 Spain
| University | Short Name | Email Domain |
|---|---|---|
| Universitat de València | UV | `uv.es` |

### Adding a University

To add a new university, add an entry to `lib/universities.ts` with the search query, email domain, country, city, and brand colors. The i18n completeness test will catch any missing translation keys.

## Tech Stack

- **Framework:** Next.js 13.4.5 (App Router)
- **UI:** React 18 + MUI (Material UI) + Tailwind CSS
- **State:** React Query (TanStack Query)
- **Animations:** Framer Motion
- **i18n:** next-intl v3 (en, it, fr)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Running the Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test:i18n    # Verify i18n key completeness across all locales
```

## Project Structure

```
app/
├── [locale]/              # i18n locale segment (en/it/fr)
│   ├── layout.tsx         # Root layout with NextIntlClientProvider
│   └── (home)/            # Main pages
│       ├── page.tsx       # Home — library grid
│       ├── library/[id]/  # Library detail, floor, seat selection
│       └── disclaimer/    # Legal disclaimer page
├── api/libraries/         # Server-side API proxy
├── layout.tsx             # Minimal root shell
components/
├── UniversitySelectModal   # First-visit university picker
├── UniversityContext        # University state + localStorage
├── DisclaimerModal          # Disclaimer acknowledgment
├── EmailModal               # Email input modal
├── UNavbar / Footer         # Navigation & footer
lib/
├── universities.ts         # University definitions (20+)
├── config.ts               # API URLs
├── getLibraries.ts         # Fetch libraries from Affluences
├── getSeats.ts / getAllSeats.ts
├── findBestBooking.ts      # Booking optimization
├── reservation.ts          # Reservation API
messages/
├── en.json / it.json / fr.json  # Translation files (121 keys each)
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
