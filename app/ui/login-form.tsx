export default function LoginForm() {
  return (
    <form>
      <div className="mb-4">
        <input
          type="text"
          name="username"
          className="w-full border border-gray-200 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          name="password"
          className="w-full border border-gray-200 rounded p-2"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}
