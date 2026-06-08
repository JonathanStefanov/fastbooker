import UNavbar from '@/components/UNavbar'
import Footer from '@/components/Footer'
import DisclaimerModal from '@/components/DisclaimerModal'
import EmailModal from '@/components/EmailModal'

export default function HomeLayout({ children }) {
  return (
    <>
      <DisclaimerModal />
      <EmailModal />
      <UNavbar/>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}
