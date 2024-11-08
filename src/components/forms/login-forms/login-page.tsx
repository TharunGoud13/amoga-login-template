"use client";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "../../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

// Define form schema with validation rules
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const otpFormSchema = z.object({
  mobile: z
    .string()
    .min(10,{message: "Enter Valid Mobile Number"})
    .max(10,{message: "Enter Valid Mobile Number"})
    .nonempty({ message: "Mobile is required" }),
});

type UserFormValue = z.infer<typeof formSchema>;

type OtpFormValue = z.infer<typeof otpFormSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [showLoginOtpField, setShowLoginOtpField] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const otpForm = useForm<OtpFormValue>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const result: any = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!result?.error) {
        router.push("/");
      } else {
        let text: any = document.getElementById("error-text");
        text.textContent = "Invalid credentials, please try again.";
        toast({
          description: "Invalid credentials, please try again.",
          variant: "destructive",
        });
        router.push("/applogin");
      }
    } catch (error) {
      router.push("/applogin");
      toast({
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data: OtpFormValue) => {
    console.log("OTP=====", data);
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        defaultValue="email"
        onValueChange={setLoginMethod}
        className="flex space-x-4 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="email-login" />
          <Label htmlFor="email-login">Email</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mobile" id="mobile-login" />
          <Label htmlFor="mobile-login">Mobile</Label>
        </div>
      </RadioGroup>

      {loginMethod === "email" && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
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
                        type="email"
                        placeholder="Email"
                        disabled={loading}
                        className="focus:!ring-offset-0 focus:!ring-0"
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
                      Password <span className="text-red-500 mr-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="border-secondary gap-2 rounded-md border flex items-center">
                        <Input
                          type={`${showPassword ? "text" : "password"}`}
                          placeholder="Password"
                          disabled={loading}
                          className="focus:!ring-offset-0 border-none focus:!ring-0"
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
              <p id="error-text" className="font-md text-red-500"></p>

              <Button
                disabled={loading}
                className="ml-auto w-full"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>
        </>
      )}

      {loginMethod === "mobile" && (
        <>
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onSubmitOtp)}>
              <div className="space-y-3">
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
                          type="tel"
                          placeholder="+1234567890"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <Label htmlFor="mobile" className="flex items-center"></Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+1234567890"
                  required
                /> */}
              
               <Button
               disabled={loading}
                type="submit"
                className="w-full"
              >
                Get OTP
              </Button>
              </div>
            </form>

            {/* {showLoginOtpField && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center">
                  <span className="text-red-500 mr-1">*</span>OTP
                </Label>
                <Input id="otp" type="text" placeholder="Enter OTP" required />
              </div>
            )}  */}
          </Form>
        </>
      )}
    </div>
  );
};

export default LoginPage;
