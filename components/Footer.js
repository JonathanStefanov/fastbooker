export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-sm text-gray-600 text-center space-y-2">
          <p>
            ⚠️ <strong>Disclaimer:</strong> FastBooker is an unofficial, independent project 
            not affiliated with Affluences. Use at your own risk.
          </p>
          <p className="text-xs">
            <a href="/disclaimer" className="underline hover:text-gray-900 mr-4">
              Full Legal Disclaimer
            </a>
            <a 
              href="https://github.com/JonathanStefanov/fastbooker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 mr-4"
            >
              Source Code
            </a>
            <a 
              href="https://affluences.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              Official Affluences App
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Educational project • MIT License • No warranty provided
          </p>
        </div>
      </div>
    </footer>
  );
}
