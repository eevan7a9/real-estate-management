import { EnquiryTopic } from "../enums/enquiries.js";

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation
  ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat
  non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export const enquiries = [
  {
    enquiry_id: "01",
    content: longText,
    email: "test@test.com",
    title: "Sed ut perspiciatis unde omnis iste?",
    topic: EnquiryTopic.schedule,
    read: true,
    property: {
      name: "Homemaker Grande A",
      id: "02311",
    },
    user: {
      from: "01",
      to: "02",
    },
  },
  {
    enquiry_id: "02",
    content: longText,
    email: "dsttt@test.com",
    title: "FfaH Sed ut perspi SDt perspiciatis unde omnis iste?",
    topic: EnquiryTopic.schedule,
    read: true,
    property: {
      name: "Homemaker Grande B",
      id: "0231",
    },
    user: {
      from: "01",
      to: "02",
    },
  },
];
