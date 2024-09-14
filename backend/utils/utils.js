export const extractBasicInfo = (text) => {
  const nameRegex = /Name:\s*(.+)/;
  const emailRegex = /Email:\s*([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/;
  const phoneRegex = /Phone:\s*(\d{10})/;

  return {
    name: (text.match(nameRegex) || [])[1],
    email: (text.match(emailRegex) || [])[1],
    phone: (text.match(phoneRegex) || [])[1],
  };
};
