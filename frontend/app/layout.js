import "./globals.css";

export const metadata = {
  title: "MentriQ Shadow - Experience the Job Before Getting the Job",
  description: "AI-powered career simulations that let you work real tasks, get expert feedback, and build a verifiable track record.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
