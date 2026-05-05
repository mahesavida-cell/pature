
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function AuthPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 space-y-2">
            <Heading level={2}>Welcome to InfoFlow</Heading>
            <BodyText>Connect with the stories that matter most.</BodyText>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">Forgot password?</Button>
                      </div>
                      <Input id="password" type="password" />
                    </div>
                    <Button className="w-full">Sign In</Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" />
                    </div>
                    <Button className="w-full">Create Account</Button>
                    <MutedText className="text-[10px] text-center block pt-2">
                      By clicking register, you agree to our Terms of Service and Privacy Policy.
                    </MutedText>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
