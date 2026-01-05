import { defineAction } from "astro:actions";
import { contactSchema } from "@/lib/contact-schema";

export const submitContact = defineAction({
  accept: "form",
  input: contactSchema,

  async handler(data) {
    // Replace with email / DB / webhook
    console.log("Contact form submission:", data);

    return {
      success: true,
    };
  },
});
