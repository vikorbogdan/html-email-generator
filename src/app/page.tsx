"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeFormIndex, setActiveFormIndex] = useState(0);
  const [content, setContent] = useState("");
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [formContent, setFormContent] = useState<Record<string, string>>({});
  const [email, setEmail] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        setContent(content as string);
      };
      reader.readAsText(file);
    }
    setFileName(file?.name || "");
  };
  const handleDownloadEmailClick = () => {
    let emailContent = email;
    Object.entries(formContent).forEach(([key, value]) => {
      console.log(key, value);
      emailContent = emailContent.replace(`{{${key}}}`, value);
    });
    console.log(emailContent);
    // create a blob and download the email
    const blob = new Blob([emailContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.split(".")[0] + "-filled.html";
    a.click();
  };

  useEffect(() => {
    const regex = /\{\{[^}]*?-[^}]*?\}\}/g;
    const matches = content.match(regex);
    if (matches) {
      setPlaceholders(matches.map((match) => match.slice(2, -2)));
    }
    setEmail(content);
  }, [content]);

  const handleNext = () => {
    setActiveFormIndex((index) => index + 1);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {activeFormIndex === 0 && (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Upload E-mail template</CardTitle>
            <CardDescription>
              Use the form below to upload a ".html" template file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input type="file" onChange={handleFileChange} accept=".html" />
          </CardContent>
          <CardFooter>
            <Button onClick={handleNext}>Next</Button>
          </CardFooter>
        </Card>
      )}
      {activeFormIndex === 1 && (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Fill the placeholders</CardTitle>
            <CardDescription>
              Use the form below to fill out the template you uploaded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {placeholders.map((placeholder) => (
              <div key={placeholder} className="mb-4">
                <label htmlFor={placeholder}>{placeholder}</label>
                {placeholder.split("-").at(-1) !== "text" ? (
                  <Input
                    onChange={(e) =>
                      setFormContent((prev) => ({
                        ...prev,
                        [placeholder]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <Textarea
                    id={placeholder}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setFormContent((prev) => ({
                        ...prev,
                        [placeholder]: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></Textarea>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleDownloadEmailClick}
              className="hover:bg-[#27B074]"
            >
              Download HTML E-mail
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
