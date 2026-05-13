import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import API from "../api/axios";

import {
  useAuth
} from "../context/AuthContext";

const Login = () => {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [
    formData,
    setFormData
  ] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const { data } =
          await API.post(
            "/auth/login",
            formData
          );

        login(data);

        navigate("/");

      } catch (error) {

        alert(
          error.response?.data?.message
        );
      }
    };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#020817]
      px-4
    "
    >

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-blue-500/10
        via-transparent
        to-cyan-500/10
      "
      ></div>

      <form
        onSubmit={handleSubmit}
        className="
        relative
        z-10
        w-full
        max-w-md
        bg-slate-900/80
        backdrop-blur-xl
        border
        border-slate-800
        rounded-3xl
        p-8
        shadow-2xl
        flex
        flex-col
        gap-5
      "
      >

        <div className="text-center">

          <h1
            className="
            text-4xl
            font-bold
            mb-2
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            text-slate-400
          "
          >
            Login to continue chatting
          </p>

        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="
          p-4
          rounded-2xl
          bg-slate-800
          border
          border-slate-700
          outline-none
          focus:border-blue-500
          transition-all
        "
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="
          p-4
          rounded-2xl
          bg-slate-800
          border
          border-slate-700
          outline-none
          focus:border-blue-500
          transition-all
        "
        />

        <button
          className="
          bg-gradient-to-r
          from-blue-500
          to-cyan-600
          hover:scale-[1.02]
          transition-all
          p-4
          rounded-2xl
          font-semibold
          shadow-lg
        "
        >
          Login
        </button>

        <Link
          to="/register"
          className="
          text-center
          text-blue-400
          hover:text-blue-300
          transition-all
        "
        >
          Create account
        </Link>

      </form>

    </div>
  );
};

export default Login;