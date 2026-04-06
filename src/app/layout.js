import './globals.css';

export const metadata = {
  title: 'Mission Control',
  description: 'Custom mission control'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
