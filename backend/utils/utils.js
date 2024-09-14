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

export const extractRawSections = (text) => {
  const projectsRegex = /Projects:(.*?)(Experience:|$)/s;
  const experienceRegex = /Experience:(.*?)(Skills:|$)/s;

  return {
    rawProjects: (text.match(projectsRegex) || [])[1].trim(),
    rawExperience: (text.match(experienceRegex) || [])[1].trim(),
  };
};

export const extractTextFromPdf = async (pdfDoc) => {
  let allText = "";
  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const text = await page.getTextContent();
    allText += text;
  }

  return allText;
};
