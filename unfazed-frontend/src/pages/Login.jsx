import { useState } from "react";

const Login = () => {
  const [state, setState] = useState("Login");

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-3xl font-bold text-center text-blue-600">
          {state}
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Welcome to MediCare
        </p>

        {state === "Sign Up" && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mt-6 border rounded-lg p-3"
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mt-4 border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 border rounded-lg p-3"
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
        >
          {state}
        </button>

        {state === "Login" ? (
          <p className="text-center mt-5">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-600 cursor-pointer"
            >
              Create one
            </span>
          </p>
        ) : (
          <p className="text-center mt-5">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

      </form>
    </div>
  );
};

export default Login;