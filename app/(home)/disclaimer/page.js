export const metadata = {
  title: 'Legal Disclaimer - FastBooker',
  description: 'Legal disclaimer and terms of use for FastBooker',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">⚠️ Legal Disclaimer</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Not Affiliated with Affluences</h2>
          <p className="text-gray-700">
            <strong>FastBooker is an independent, unofficial project and is NOT affiliated with, 
            endorsed by, or connected to Affluences in any way.</strong>
          </p>
          <p className="text-gray-700">
            This application was created through reverse-engineering of the Affluences API for 
            educational purposes and to demonstrate improved user experience design.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Use at Your Own Risk</h2>
          <p className="text-gray-700">
            By using FastBooker, you acknowledge and accept the following risks:
          </p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Potential Risks</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Terms of Service Violations:</strong> Using this tool likely violates Affluences&apos; Terms of Service</li>
            <li><strong>Account Suspension:</strong> Your Affluences account may be suspended or permanently banned</li>
            <li><strong>Service Interruption:</strong> This service may stop working at any time if Affluences changes their API</li>
            <li><strong>No Warranty:</strong> This software is provided &quot;AS IS&quot; without warranty of any kind</li>
            <li><strong>Legal Consequences:</strong> Unauthorized API access may have legal implications in some jurisdictions</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Your Responsibilities</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>You will use this tool responsibly and ethically</li>
            <li>You will not abuse the service with excessive requests</li>
            <li>You will comply with your university&apos;s policies and applicable laws</li>
            <li>You accept full responsibility for any consequences resulting from use</li>
            <li>You understand this is for personal, non-commercial use only</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Educational Purpose</h2>
          <p className="text-gray-700">This project was created for:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Educational purposes</li>
            <li>Demonstrating API integration techniques</li>
            <li>Showcasing improved UX/UI design</li>
            <li>Personal, non-commercial use</li>
          </ul>
          <p className="text-gray-700 mt-3">This project is NOT intended for:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Commercial use</li>
            <li>Circumventing legitimate access controls</li>
            <li>Unfairly monopolizing library resources</li>
            <li>Causing harm to Affluences&apos; infrastructure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Ethical Use Guidelines</h2>
          <p className="text-gray-700">If you choose to use FastBooker:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Be respectful of Affluences&apos; infrastructure</li>
            <li>Don&apos;t make excessive API requests</li>
            <li>Don&apos;t use automated booking to unfairly monopolize resources</li>
            <li>Consider the impact on other students</li>
            <li>Support the official Affluences app when possible</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Contact</h2>
          <p className="text-gray-700">
            <strong>For Affluences Representatives:</strong> If you have concerns about this project, 
            please contact the repository owner through{' '}
            <a href="https://github.com/JonathanStefanov/fastbooker/issues" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              GitHub issues
            </a>. We will respond promptly and cooperatively.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>For Users:</strong> If you have questions or concerns, please open an issue on GitHub.
          </p>
        </section>

        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">No Warranty</h2>
          <p className="text-gray-600 text-sm">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
            INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
            PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
            FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
            ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">Last Updated: January 2026</p>
          <div className="flex justify-center gap-4 mt-4">
            <a 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </a>
            <a 
              href="https://affluences.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Visit Official Affluences
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
