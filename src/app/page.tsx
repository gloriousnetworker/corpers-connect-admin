export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-xl bg-[#008751] flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">CC</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Corpers Connect</h1>
        <span className="inline-block mt-1 text-xs font-semibold tracking-widest text-[#008751] uppercase">
          Admin Portal
        </span>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Administrator Sign In</h2>
        <p className="text-gray-400 text-sm mb-6">Restricted access — authorised personnel only</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@corpers-connect.ng"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
            />
          </div>
          <button className="w-full bg-[#008751] hover:bg-[#006b3f] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            Sign In
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        © {new Date().getFullYear()} Corpers Connect Admin
      </p>
    </div>
  );
}
