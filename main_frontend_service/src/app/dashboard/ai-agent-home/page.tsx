export default function AIAgent() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-black shadow-lg rounded-xl p-16 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">AI Agent</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Here you’ll be able to build smart AI agents for any use case.<br/>
            (Feature coming soon — contribute on GitHub!)
          </p>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl text-center text-base mb-6">
          This platform is open source — contribute & make AI accessible to everyone. 
          <a href="https://github.com/Rakib-Hasan25/olychat" target="_blank" rel="noopener noreferrer" className="ml-1 text-purple-600 hover:underline font-medium">View on GitHub.</a>
        </p>
        </div>
      </div>
    );
  }