import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { DEMO_ACCOUNTS } from "../data/demoData";

const Login = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupRole, setSignupRole] = useState("patient");
  const [speciality, setSpeciality] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [loginRole, setLoginRole] = useState("patient");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let user;
      if (state === "Sign Up") {
        user = await register({
          name,
          email,
          password,
          role: signupRole,
          ...(signupRole === "doctor" && { speciality, experience, fees }),
        });
      } else {
        user = await login({ email, password }, loginRole);
      }
      navigate(user.role === "doctor" ? "/doctor-dashboard" : "/dashboard");
    } catch (requestError) {
      const status = requestError.response?.status;
      if (status === 502 || requestError.code === "ERR_NETWORK") {
        setError(
          "Cannot reach the backend. Make sure it is running, then try again.",
        );
      } else {
        setError(
          requestError.response?.data?.message ||
            "Unable to authenticate. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-190px)] items-center justify-center py-10">
      <div className="auth-layout">
        <aside className="auth-intro">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-3xl font-light">+</span>
            <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-teal-100">
              Care, connected
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
              Your health journey starts here.
            </h1>
            <p className="mt-4 max-w-sm text-sm">
              Manage appointments and connect with your care team in one secure place.
            </p>
          </div>
          <p className="auth-art-note text-xs">A simpler way to manage your healthcare.</p>
        </aside>
        <div className="auth-form-wrap">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
          UNFAZED CARE PORTAL
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
          {state}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {state === "Login" ? "Sign in to continue to your account." : "Create an account to get started."}
        </p>

        {state === "Sign Up" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="form-control mt-6"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Create account as
              </span>
              <select
                value={signupRole}
                onChange={(event) => setSignupRole(event.target.value)}
                className="form-control"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </label>
            {signupRole === "doctor" && (
              <>
                <input
                  type="text"
                  placeholder="Medical speciality"
                  className="form-control mt-4"
                  value={speciality}
                  onChange={(event) => setSpeciality(event.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Years of experience"
                  className="form-control mt-4"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                />
                <input
                  type="number"
                  placeholder="Consultation fee"
                  min="0"
                  className="w-full mt-4 border rounded-lg p-3"
                  value={fees}
                  onChange={(event) => setFees(event.target.value)}
                />
              </>
            )}
          </>
        )}

        {state === "Login" && (
          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-medium text-gray-700">
              Sign in as
            </span>
            <select
              value={loginRole}
              onChange={(event) => setLoginRole(event.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </label>
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mt-4 border rounded-lg p-3"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 border rounded-lg p-3"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary mt-6 w-full"
        >
          {isSubmitting ? "Please wait..." : state}
        </button>

        {state === "Login" && (
          <section className="demo-credentials" aria-labelledby="demo-credentials-title">
            <div className="demo-credentials-heading">
              <span><strong id="demo-credentials-title">Presentation demo accounts</strong><small>Choose an account to fill the form</small></span>
              <span className="demo-only-badge">UI demo</span>
            </div>
            <div className="demo-credentials-grid">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  type="button"
                  className="demo-credential-button"
                  key={account.email}
                  onClick={() => {
                    setState("Login");
                    setLoginRole(account.role.toLowerCase());
                    setEmail(account.email);
                    setPassword(account.password);
                    setError("");
                  }}
                >
                  <span><strong>{account.role}</strong><small>{account.email}</small><small>Password: {account.password}</small></span>
                  <span>Fill</span>
                </button>
              ))}
            </div>
            <p className="demo-credentials-note">These accounts use normal backend authentication. Run <code>npm run seed:demo</code> in the backend once to add any missing demo accounts.</p>
          </section>
        )}

        {state === "Login" ? (
          <p className="text-center mt-5">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setState("Sign Up");
                setSignupRole("patient");
              }}
              className="text-blue-600"
            >
              Create one
            </button>
          </p>
        ) : (
          <p className="text-center mt-5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setState("Login");
                setSignupRole("patient");
              }}
              className="text-blue-600"
            >
              Login
            </button>
          </p>
        )}

      </form>
        </div>
      </div>
    </div>
  );
};

export default Login;