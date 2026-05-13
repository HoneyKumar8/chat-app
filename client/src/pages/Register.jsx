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

const Register = () => {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [
    formData,
    setFormData
  ] = useState({
    username: "",
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
            "/auth/register",
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
        to-purple-500/10
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
            Create Account
          </h1>

          <p
            className="
            text-slate-400
          "
          >
            Join the conversation
          </p>

        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
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
          from-green-500
          to-emerald-600
          hover:scale-[1.02]
          transition-all
          p-4
          rounded-2xl
          font-semibold
          shadow-lg
        "
        >
          Register
        </button>

        <Link
          to="/login"
          className="
          text-center
          text-blue-400
          hover:text-blue-300
          transition-all
        "
        >
          Already have an account?
        </Link>

      </form>

    </div>
  );
};

export default Register;