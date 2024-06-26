"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { callAPI } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  email: z.string().email({
    message: "Required",
  }),
  password: z.string().min(1, {
    message: "Required",
  }),
});

const formRegisterSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Not Strong enough!"
    ),

  email: z.string().email({ message: "Please enter a valid email" }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // 1. Define your form.
  const formLogin = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmitLogin(values: z.infer<typeof formSchema>) {
    const data = await callAPI({
      url: "admin/login",
      method: "POST",
      body: JSON.stringify(values),
      setIsLoading,
      toast: {
        toastFn: toast,
        success: {
          title: "Success",
          description: "Login Success",
          variant: "success",
        },
        error: {
          title: "Error",
          // description: "Login Failed",
          variant: "destructive",
        },
      },
    });
    localStorage.setItem("access_token", data.access_token);
    
    router.push("/dashboard");
  }

  // Register dialog
  const formRegister = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  function onSubmitRegister(values: z.infer<typeof formRegisterSchema>) {
    console.log(values);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px] mx-auto my-auto Card">
        <div className="Avatar">
          <Image
            className="rounded-full"
            src="/dollar-logo.png"
            alt="Example Image"
            width={70}
            height={70}
          />
        </div>
        <CardHeader className="my-5">
          <CardTitle>Login Page</CardTitle>
          <CardDescription>Everything you need is my todo-list</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formLogin}>
            <form>
              <FormField
                control={formLogin.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email..." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <br />
              <FormField
                control={formLogin.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between m-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Register</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Be one of the best traders</DialogTitle>
                <DialogDescription>Register real quick!</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...formRegister}>
                  <form>
                    <FormField
                      control={formRegister.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-x-4">
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="username..."
                              {...field}
                              className="col-span-3"
                            />
                          </FormControl>
                          <FormMessage className="col-start-2 col-span-3 mt-0" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRegister.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-x-4">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="password..."
                              {...field}
                              className="col-span-3"
                            />
                          </FormControl>
                          <FormMessage className="col-start-2 col-span-3 mt-0" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formRegister.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-x-4">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email..."
                              {...field}
                              className="col-span-3"
                            />
                          </FormControl>
                          <FormMessage className="col-start-2 col-span-3 mt-0" />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => formRegister.handleSubmit(onSubmitRegister)()}
                >
                  Become a trader
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            style={{ width: "100px" }}
            onClick={() => formLogin.handleSubmit(onSubmitLogin)()}
          >
            <div>
              {isLoading ? <LoadingSpinner className="" /> : "Let's Go"}
            </div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
