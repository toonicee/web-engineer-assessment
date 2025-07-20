import "./globals.css";
import Navbar from "@/components/Navbar";

export default function Layout() {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex flex-grow items-center justify-center text-center p-4">
          <div>
            <h1 className="text-4xl font-bold text-gray mb-4">
              Welcome to the Web Engineer Assessment
            </h1>
            <p className="text-lg text-gray-500">
              We are glad to have you here. Let's get started!
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
