

"use client"
import Link from 'next/link';
import styles from './login.module.css';
import { useFormik } from 'formik';
import {loginSchema} from "../../../validation/schemas"
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

import { setCookie } from 'cookies-next';
// Define the shape of form values
interface FormValues {
  email: string;
  password: string;
}



export default function LoginPage() {
    const router = useRouter()
    
  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema:loginSchema,
    onSubmit: async(values,{resetForm}) => {
      try {
        // Handle form submission (e.g., API call)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/user/login`,values,{withCredentials:true})
        if(response.data  && response.data.message=== "loginSuccessfull"){
          toast.success(response.data.message, {
            position: "bottom-right",
          })
          resetForm()
          
          // localStorage.setItem("accessToken",response.data.token)
          setCookie('accessToken', response.data.token);
          router.replace("/user/myinvoice")
        }
      } catch (error) {
       if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message|| 'login failed', {
          position: "bottom-right",
        });
      } else {
        toast.error('Something went wrong. Please try again.', {
          position: "bottom-right",
        });
      }
      }
    
    },
  });


  const handleGoogleLogin =async()=>{
    window.open(
      `${process.env.NEXT_PUBLIC_SERVER}/auth/google`,
      "_self"
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className={styles.error}>{formik.errors.email}</div>
          ) : null}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className={styles.error}>{formik.errors.password}</div>
          ) : null}

         <button 
            type="submit" 
            className={styles.button} 
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
          <p className={styles.text}>
            Don&apos;t have an account?{' '}
            <Link href="/account/signup" className={styles.link}>
              Signup
            </Link>
          </p>
        </form>
        <button onClick={handleGoogleLogin} className={styles.googleButton}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={styles.googleIcon}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
      </svg>
      <span>Login with Google</span>
    </button>
        {/* {serverSuccessMessage && (
          <div className={styles.successMessage}>
            {serverSuccessMessage}
          </div>
        )}

        {serverErrorMessage && (
          <div className={styles.errorMessage}>
            {serverErrorMessage}
          </div>
        )} */}
      </div>
    </div>
  );
}

