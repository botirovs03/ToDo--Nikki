import React, { useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as qs from "qs";
import Swal from "sweetalert2";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>(""); // State to store error message
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    rpassword: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Basic form validation
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password ||
      !formData.rpassword
    ) {
      setErrorMessage("すべてのフィールドを入力してください。");
      return;
    }

    if (formData.password !== formData.rpassword) {
      setErrorMessage("パスワードとパスワード再入力が一致しません。");
      return;
    }

    // Reset error message
    setErrorMessage("");

    // Gather data from the input fields
    let data = qs.stringify({
      password: formData.password,
      email: formData.email,
      username: formData.firstname + " " + formData.lastname,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3001/api/users",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // just created new user
        // need to post auth data

        //to automatically login after registering
        config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "http://localhost:3001/api/auth",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            // You can replace this with your own logic
            const token = response.data.token;
            
            // Save the user token and status in localStorage
            localStorage.setItem("user", "true");
            localStorage.setItem("token", token);

            // Navigate to the home page
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        if (error.response.data.errormsg.errno == 1062) {
          // Display a message in Japanese if the email address is already registered
          Swal.fire({
            icon: "error",
            title: "エラー",
            text: "このメールアドレスは既に登録されています。",
            showConfirmButton: false,
            timer: 2000,
          });
        }
        console.log(error);
      });
  };

  return (
    <div className="container">
      <div className="logo"></div>

      <div className="form">
        <span className="title">アカウントを作成</span>
        <span className="entrance-span">お客様の仕事を整理します</span>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleSubmit} action="" method="">
          <label className="entrance-label" htmlFor="fname">
            名
          </label>
          <input
            className="entrance-input"
            name="firstname"
            type="text"
            placeholder="名を入力してください"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />

          <label className="entrance-label" htmlFor="lname">
            姓
          </label>
          <input
            className="entrance-input"
            name="lastname"
            type="text"
            placeholder="姓を入力してください"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />

          <label className="entrance-label" htmlFor="email">
            メールアドレス
          </label>
          <input
            className="entrance-input"
            name="email"
            type="email"
            placeholder="お客様のメールアドレス"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <label className="entrance-label" htmlFor="password">
            パスワード
          </label>
          <input
            className="entrance-input"
            name="password"
            type="password"
            placeholder="安全なパスワードを作成してくだいさい"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <label className="entrance-label" htmlFor="rpassword">
            パスワード再入力
          </label>
          <input
            className="entrance-input"
            name="rpassword"
            type="password"
            placeholder="パスワードを繰り返してください"
            value={formData.rpassword}
            onChange={(e) =>
              setFormData({ ...formData, rpassword: e.target.value })
            }
          />

          <button className="entrance-button" type="submit">
            アカウントを作成
          </button>
        </form>
        <span className="entrance-span">
          現在ログインしていますか？
          <Link className="entrance-a" to='/login'>
            ログイン
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
