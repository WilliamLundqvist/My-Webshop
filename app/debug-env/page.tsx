export default function DebugEnvPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      
      <div className="bg-surface p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">WordPress Connection</h2>
        <ul className="list-disc pl-5">
          <li className="mb-2">
            <strong>WORDPRESS_URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_URL || 'Not set'}
          </li>
          <li className="mb-2">
            <strong>FAUST_SECRET_KEY:</strong> {process.env.FAUST_SECRET_KEY ? '✓ Set (hidden for security)' : '✗ Not set'}
          </li>
        </ul>
      </div>
      
      <div className="alert alert-info">
        <p>If you've recently changed these values, you may need to:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li className="mb-1">Stop your Next.js server</li>
          <li className="mb-1">Clear your browser cache</li>
          <li className="mb-1">Restart your Next.js server</li>
        </ol>
      </div>
    </div>
  );
} 