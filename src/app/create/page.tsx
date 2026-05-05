
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Save, Globe, Eye, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePost() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <Heading level={2}>Create New Post</Heading>
            <BodyText>Share Your Insights With The InfoFlow Community.</BodyText>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button size="sm" className="gap-2">
              <Globe className="h-4 w-4" /> Publish
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="post-title" className="text-lg font-headline">Article Title</Label>
                <Input 
                  id="post-title" 
                  placeholder="Enter A Compelling Title..." 
                  className="text-xl h-14 font-headline border-none shadow-none bg-accent/5 focus-visible:ring-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="culture">Culture</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read-time">Estimated Read Time (Minutes)</Label>
                  <Input id="read-time" type="number" placeholder="5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center space-y-4 hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <BodyText className="font-medium">Click To Upload Or Drag And Drop</BodyText>
                    <BodyText className="text-sm">PNG, JPG Or WebP (Max. 10MB)</BodyText>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Short Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  placeholder="Summarize The Core Message Of Your Post..." 
                  className="resize-none min-h-[100px] bg-accent/5 border-none shadow-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Main Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write Your Story Here. Use Markdown For Formatting..." 
                  className="min-h-[400px] bg-accent/5 border-none shadow-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" className="gap-2">
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button className="px-12">Publish Now</Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
