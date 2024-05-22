"use client"
import axios from "axios";
import * as z from "zod";
import { Heading } from '@/components/heading';
import { Code, MessageSquare } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from 'react-markdown';


interface Message {
    content: string;
    role: 'user' | 'server';
}

const CodePage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const newMessageUser: Message = { content: values.prompt, role: 'user' };
            setMessages([...messages, newMessageUser]);
    
            
            const response = await axios.post('/api/code', {
                message: [{ role: 'user', content: values.prompt }]
            });
    
          
            const newMessageBot: Message = { content: response.data.content, role: 'server' };
            setMessages(prevMessages => [...prevMessages, newMessageBot]);
    

            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
           
            router.refresh();
        }
    };
    return (
        <div>
            <Heading
                title="Code Generation"
                description="Advanced code generation model using descriptive text."
                icon={Code}
                iconColor="text-green-500"
                bgColor="bg-green-500/10"
            />
            <div className='px-4 lg:px-8'>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 md:p-6 focus-within:shadow-sm grid grid-cols-12 gap-4"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl>
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Type your message..."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="mt-4 space-y-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted ">
                            <Loader />
                        </div>
                    )

                    }
                    {messages.length === 0 && !isLoading && (
                        <div>
                            Empty!!
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", msg.role === "user" ? "bg-white border border-black/10" : "bg-muted")}>
                                {msg.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                 components={{
                                    pre: ({node, ...props}) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                         <pre {...props} />
                                        </div>
                                    ),
                                    code: ({node , ...props}) => (
                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                    )
                                 }}
                                 className="text-sm overflow-hidden leading-7"
                                >
                                {msg.content || ""}
                                </ReactMarkdown>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePage;
