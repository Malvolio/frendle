import baseEmail from "./baseEmail.ts";

const createWelcomeEmail = (name: string | null) => {
  const subject = "Welcome to Frendle!";
  const lede = `We're excited to have you on board${name ? `, ${name}` : ""}!`;
  const text = `${lede}
  Frendle is all about connecting with friends and making new ones. Start exploring the platform and let us know what you think!`;
  const body = `
    <p>${lede}</p>
    <p>Frendle is all about connecting with friends and making new ones. Start exploring the platform and let us know what you think!</p>`;
  const html = baseEmail(subject, body);
  return { text, html, subject };
};

export default createWelcomeEmail;
