import Link from "next/link"
import ContactForm from "@/components/ui/ContactForm"
import Accordion, { AccordionItem } from "@/components/ui/Accordion"

export default function Contact() {
  const faqItems: AccordionItem[] = [
    {
      question: "What services do you offer?",
      answer: (
        <p>
          I offer mixing, mastering, audio editing, and more.
        </p>
      )
    },
    {
      question: "I live outside of Canada, are you still able to mix/master my music?",
      answer: (
        <p>
          Yes, I have an efficient way of transferring files to and from my clients
          regardless of the country they live in (Google Drive, WeTransfer, and others).
          I also offer Zoom/Skype meetings so we can discuss your project needs.
        </p>
      )
    },
    {
      question: "How long does it take for you to mix/master my songs?",
      answer: (
        <p>
          My usual turnaround time is anywhere between 2-5 business days per song,
          depending on project size (total number of tracks or specific requests).
        </p>
      )
    },
    {
      question: "What is your refund policy?",
      answer: (
        <div>
          <p>
            All Audio Engineering Services purchases require a non-refundable deposit worth
            25% of the total sale price in order to book the service and choose a project
            start date. All Audio Engineering Services purchases do, however, come with a
            30-day money back guarantee (up to and including 30 days after the date of
            purchase) for the full remaining 75% of the sale price.
          <br></br>
            All other digital purchases, such as Samples, Loops, digital download Music,
            are non-refundable. All digital sales are final.
          <br></br>
            All physical products are non-refundable. All physical sales are final.
          </p>
        </div>
      )
    },
    {
      question: "How do I submit my tracks?",
      answer: (
        <p>
          You can upload your tracks via my public google drive upload link
          or you can send me a download link.
        </p>
      )
    },
    {
      question: "Are your samples and loops royalty free?",
      answer: (
        <p>
          Yes! All of my samples and loops are royalty free, meaning once you have
          purchased them you are free to use them in your productions and sell your
          music. You may not, however, redistribute the sample and loop packs (giving
          away or selling the sample and loop packs is a breach of copyright laws).
        </p>
      )
    },
    {
      question: "Do you collaborate with other artists?",
      answer: (
        <p>
          Yes! I&apos;m able to collaborate using Steinberg Cubase&apos;s VST Connect, or by
          sharing complete project files (either Ableton, Cubase, or Bitwig projects).
        </p>
      )
    }
  ];

  return (
    <div id="page-contact-main">
      <h1 id="contact-me">Contact Me</h1>
      <p>
        Feel free to contact me with any questions you may have
        about my services, or if you would like to discuss a project.
        Have questions about
        <Link href="/mixing-and-mastering"
          className="text-accent hover:text-primary">
          {" "}Mixing & Mastering Services
        </Link>
        ,
        <Link href="/education"
          className="text-accent hover:text-primary">
          {" "}Educational Services
        </Link>
        ,
        <Link href="/education/#cubase"
          className="text-accent hover:text-primary">
          {" "}Cubase
        </Link>
        ,
        <Link href="/samples-and-loops"
        className="text-accent hover:text-primary">
          {" "}Samples & Loops
        </Link>
        , or anything else?
      </p>
      <p>
        You can use the form below to send me a message:
      </p>
      <ContactForm />

      <div className="flex flex-col flex-wrap">
        <div id="faq" className="pb-8">
          <h1>FAQ</h1>
          <h5>Answers to some frequently asked questions.</h5>
        </div>
        <Accordion items={faqItems} className="max-w-4xl mx-auto" />
      </div>
    </div>
  )
}
