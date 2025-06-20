"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { GET_CONTACTS_API, NEXT_PUBLIC_API_KEY } from "@/constants/envConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    first_name: z.string().nonempty({ message: "First name is required" }),
    last_name: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    user_mobile: z
      .string()
      .min(10)
      .max(10)
      .nonempty({ message: "Mobile number is required" }),
    business_name: z
      .string()
      .nonempty({ message: "Business name is required" }),
    business_number: z
      .string()
      .min(10)
      .max(10)
      .nonempty({ message: "Business number is required" }),
    business_zipcode: z
      .string()
      .nonempty({ message: "Business zipcode is required" }),
    business_mobile: z
      .string()
      .nonempty({ message: "Business mobile is required" })
      .min(10)
      .max(10),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters .",
    }),
    retype_password: z
      .string()
      .min(8, {
        message: "Passwords don't match",
      })
      .nonempty({ message: "Required" }),
  })
  .refine((data) => data.password === data.retype_password, {
    message: "Passwords don't match",
    path: ["retype_password"],
  });

const otpFormSchema = z.object({
  first_name: z.string().nonempty({ message: "First name is required" }),
  last_name: z.string().nonempty({ message: "Last name is required" }),
  mobile: z
    .string()
    .min(10, { message: "Enter Valid Mobile Number" })
    .max(10, { message: "Enter Valid Mobile Number" })
    .nonempty({ message: "Mobile is required" }),
  otp: z.string().min(1, { message: "Enter Valid OTP" }),
});

type UserFormValue = z.infer<typeof formSchema>;
type OtpFormValue = z.infer<typeof otpFormSchema>;

const JoinPage: FC<any> = ({ setSelectedTab }) => {
  const [signupMethod, setSignupMethod] = useState("email");
  const [showSignupOtpField, setShowSignupOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState(false);
  const [tokens, setTokens] = useState<any>(null);

  React.useEffect(() => {
    const fetchTokens = async () => {
      const response = await fetch(
        "https://y0gcskgkwwgwkkooscoso8sg.219.93.129.146.sslip.io/user_devices",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXMifQ.SaPQ1nlsFVeVCY9N_AC57AH4r70fAEhe8STPGvM6rBQ`,
          },
        }
      );
      const data = await response.json();
      console.log("data-----", data);
      setTokens(data);
    };
    fetchTokens();
  }, []);

  console.log("tokens-----", tokens);

  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    user_mobile: "",
    business_name: "",
    business_number: "",
    business_zipcode: "",
    business_mobile: "",
    password: "",
    retypePassword: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const otpForm = useForm<OtpFormValue>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      mobile: "",
      otp: "",
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.first_name + " " + data.last_name,
      user_email: data.email,
      user_mobile: data.user_mobile,
      business_name: data.business_name,
      business_number: data.business_number,
      business_postcode: data.business_zipcode,
      business_phone_no: data.business_mobile,
      password: data.password,
      retype_password: data.retype_password,
    };

    const myHeaders1 = new Headers();
    myHeaders1.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    myHeaders1.append("Content-Type", "application/json");
    const requestOptions1: any = {
      method: "POST",
      headers: myHeaders1,
      body: JSON.stringify(payload),
    };

    try {
      const response1 = await fetch(GET_CONTACTS_API, requestOptions1);
      const responseData: any = await response1.text();
      console.log("responseData-----", responseData);
      console.log("response----", response1);
      if (response1.status === 201) {
        setLoading(false);
        toast({ description: "User Created Successfully", variant: "default" });

        const getUserResponse = await fetch(
          `${GET_CONTACTS_API}?user_email=eq.${data.email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            tokens.map((token: any) => ({
              to: token.expo_push_token,
              title: "New User Created",
              body: "A new user has just joined!",
            }))
          ),
        });

        const [user] = await getUserResponse.json();
        console.log("user----", user);

        if (user && user.user_catalog_id) {
          const emailVerificationResponse = await fetch("api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_email: data.email,
              user_catalog_id: user.user_catalog_id,
              user_name: data.first_name + " " + data.last_name,
            }),
          });

          if (emailVerificationResponse.ok) {
            toast({
              description: "Verification email sent",
              variant: "default",
            });
          } else {
            toast({
              description: "Failed to send verification email",
              variant: "destructive",
            });
            setVerificationError(true);
          }
        }
      } else if (response1.status === 409) {
        toast({ description: "Email already in use.", variant: "destructive" });
        return false;
        setLoading(false);
      } else {
        toast({ description: "Something went wrong", variant: "destructive" });
        setLoading(false);

        return false;
      }
      return data;
    } catch (error: any) {
      setLoading(false);

      throw new Error("Error", error);
    }
  };

  const onSendOtp = async () => {
    const { mobile } = otpForm.getValues();
    if (!mobile) {
      toast({
        description: "Mobile number is required to send OTP.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("api/otp/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });
      const result = await response.json();

      if (response.ok) {
        setOtpSessionId(result.sessionId);
        setShowSignupOtpField(true);
        toast({ description: "OTP sent successfully", variant: "default" });
      } else {
        toast({ description: "Failed to send OTP", variant: "destructive" });
      }
    } catch (error) {
      toast({
        description: "An error occurred while sending OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const registerUserDetails = async (userData: any) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${NEXT_PUBLIC_API_KEY}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(userData),
    };

    try {
      const response = await fetch(GET_CONTACTS_API, requestOptions);
      const data = await response.text();

      if (response.status === 201) {
        toast({ description: "User Created Successfully", variant: "default" });
        let text: any = document.getElementById("success-text");
        if (text) {
          text.textContent = "User Created Successfully";
        }
        return true;
      } else if (response.status === 409) {
        toast({
          description: "Mobile number already registered.",
          variant: "destructive",
        });
        return false;
      }
      return false;
    } catch (error: any) {
      toast({ description: "Failed to create user", variant: "destructive" });
      return false;
    }
  };

  const handleResendVerificationEmail = async () => {
    const { email, first_name, last_name } = form.getValues();

    try {
      const getUserResponse = await fetch(
        `${GET_CONTACTS_API}?user_email=eq.${email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const [user] = await getUserResponse.json();

      if (user && user.user_catalog_id) {
        const emailVerificationResponse = await fetch("api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: email,
            user_catalog_id: user.user_catalog_id,
            user_name: first_name + " " + last_name,
          }),
        });

        if (emailVerificationResponse.ok) {
          toast({
            description: "Verification email resent successfully",
            variant: "default",
          });
          setVerificationError(false);
        } else {
          toast({
            description: "Failed to resend verification email",
            variant: "destructive",
          });
        }
      } else {
        toast({
          description: "User details not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "An error occurred while resending verification email",
        variant: "destructive",
      });
    }
  };

  const onSubmitOtp = async (data: OtpFormValue) => {
    if (!otpSessionId) return;
    console.log("data-----", data);
    setLoading(true);

    try {
      const response = await fetch(`api/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: otpSessionId, otp: data.otp }),
      });
      const result = await response.json();
      console.log("response----", response);

      if (result.verified) {
        const userData = {
          first_name: data.first_name,
          last_name: data.last_name,
          user_mobile: data.mobile,
          user_name: data.first_name + " " + data.last_name,
        };

        const registerUser = await registerUserDetails(userData);

        if (registerUser) {
          toast({
            description: "User created successfully!",
            variant: "default",
          });
          otpForm.reset();
          setShowSignupOtpField(false);
          // setSelectedTab('login')
        }
      } else {
        toast({ description: "Invalid OTP", variant: "destructive" });
      }
    } catch (error) {
      toast({
        description: "An error occurred while verifying OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <RadioGroup
        defaultValue="email"
        onValueChange={setSignupMethod}
        className="flex space-x-4 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="email-signup" />
          <Label htmlFor="email-signup">Email</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mobile" id="mobile-signup" />
          <Label htmlFor="mobile-signup">Mobile</Label>
        </div>
      </RadioGroup>

      {signupMethod === "email" && (
        <>
          <Form {...form}>
            <h1 id="success"></h1>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="text"
                        placeholder="First name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="focus:!ring-offset-0 focus:!ring-0"
                        placeholder="Last name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="email"
                        placeholder="Email"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mobile <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="number"
                        placeholder="Mobile"
                        disabled={loading}
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Name <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="text"
                        placeholder="Business Name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Number{" "}
                      <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="text"
                        // inputMode="numeric"
                        placeholder="Business Number"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business ZipCode{" "}
                      <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="number"
                        inputMode="numeric"
                        placeholder="Business Zip Code"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Mobile{" "}
                      <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:!ring-offset-0 focus:!ring-0"
                        type="number"
                        inputMode="numeric"
                        placeholder="Business Mobile"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Set Password <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md border-secondary gap-2">
                        <Input
                          type={`${showPassword ? "text" : "password"}`}
                          className="focus:!ring-offset-0 border-none focus:!ring-0"
                          placeholder="Password"
                          disabled={loading}
                          {...field}
                        />
                        {showPassword ? (
                          <EyeOff
                            className="cursor-pointer pr-1"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer pr-1"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retype_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Re-enter Password{" "}
                      <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md border-secondary gap-2">
                        <Input
                          type={`${showRePassword ? "text" : "password"}`}
                          className="focus:!ring-offset-0 focus:!ring-0"
                          placeholder="Retype password"
                          disabled={loading}
                          {...field}
                        />
                        {showRePassword ? (
                          <EyeOff
                            className="cursor-pointer pr-1"
                            onClick={() => setShowRePassword(!showRePassword)}
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer pr-1"
                            onClick={() => setShowRePassword(!showRePassword)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-green-500 text-md" id="success-text"></p>
              <Button
                disabled={loading}
                className="ml-auto w-full"
                type="submit"
              >
                {loading ? "Join.." : "Join"}
              </Button>
              {
                <p
                  className="text-sm underline text-gray-500 text-right cursor-pointer"
                  onClick={handleResendVerificationEmail}
                >
                  Resend Verification Email
                </p>
              }
            </form>
          </Form>
        </>
      )}

      {signupMethod === "mobile" && (
        <>
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onSubmitOtp)}>
              <div className="space-y-3">
                <FormField
                  control={otpForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name
                        <span className="text-red-500 mr-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="first_name"
                          type="text"
                          placeholder="Enter your first name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={otpForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name
                        <span className="text-red-500 mr-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="last_name"
                          type="text"
                          placeholder="Enter your last name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={otpForm.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mobile Number
                        <span className="text-red-500 mr-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="mobile"
                          inputMode="numeric"
                          type="number"
                          placeholder="+1234567890"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!showSignupOtpField && (
                  <Button
                    disabled={loading}
                    className="ml-auto w-full"
                    type="button"
                    onClick={onSendOtp}
                  >
                    Get OTP
                  </Button>
                )}

                {showSignupOtpField && (
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          OTP
                          <span className="text-red-500 mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="otp"
                            inputMode="numeric"
                            type="number"
                            placeholder="Enter OTP"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {showSignupOtpField && (
                  <Button
                    disabled={loading}
                    className="ml-auto w-full"
                    type="submit"
                  >
                    Verify OTP
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default JoinPage;
