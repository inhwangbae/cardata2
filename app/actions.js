"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData) => {


  
  const password = searchParams.get("password");
  const confirmPassword = searchParams.get("confirmPassword");
  const name = searchParams.get("name");
  const mobileNumber = searchParams.get("mobileNumber");
  const recommenderEmail = searchParams.get("recommenderEmail");
  const recommenderPhone = searchParams.get("recommenderPhone");
  const region = searchParams.get("region");
  const businessName = formData.get("businessName")?.toString();
  const businessRegistrationNumber = formData.get("businessRegistrationNumber")?.toString();
  const businessCertificate = formData.get("businessCertificate")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export async function signUpFirstAction(formData) {
  
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm password")?.toString();
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const region = formData.get("region")?.toString();
  const recommenderEmail = formData.get("recommenderEmail")?.toString() || '';
  const recommenderPhone = formData.get("recommenderPhone")?.toString() || '';
  if (!password) {
    return encodedRedirect("error", "/sign-up", "Password is required");
  }
  if (!confirmPassword) {
    return encodedRedirect("error", "/sign-up", "Confirm password is required");
  }
  if (!name) {
    return encodedRedirect("error", "/sign-up", "Name is required");
  }
  if (!phone) {
    return encodedRedirect("error", "/sign-up", "Mobile number is required");
  }
  // if (!recommenderEmail) {
  //   return encodedRedirect("error", "/sign-up", "Recommender email is required");
  // }
  // if (!recommenderPhone) {
  //   return encodedRedirect("error", "/sign-up", "Recommender phone is required");
  // }
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    return encodedRedirect("error", "/sign-up", "Password must be at least 8 characters long and include at least one number and one special character");
  }
  
  if (password !== confirmPassword) {
    return encodedRedirect("error", "/sign-up", "Passwords do not match");
  }

  const params = {
    email: email,
    password: password ,
    confirmPassword: confirmPassword,
    name: name,
    phone: phone,
    recommenderEmail: recommenderEmail,
    recommenderPhone: recommenderPhone,
    region: region ?? '', // 널 병합 연산자 사용
  };

  
  
  const searchParams = new URLSearchParams(params);


  return redirect(`/sign-up2?${searchParams.toString()}`);
};

export const signInAction = async (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/list");
};

export const forgotPasswordAction = async (formData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData) => {
  const supabase = createClient();

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
