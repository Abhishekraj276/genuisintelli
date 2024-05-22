"use client"
import axios from "axios";
import * as z from "zod";
import { Heading } from '@/components/heading';
import { VideoIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";




const Videopage = () => {
    const router = useRouter();
    const [video, setVideo] = useState<string | undefined>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
         setVideo(undefined);
            
        
            const response = await axios.post('/api/video',values);
    
          
           setVideo(response.data.video);
    

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
                title="Video Generation"
                description="Turn you prompt into video."
                icon={VideoIcon}
                iconColor="text-orange-700"
                bgColor="bg-orange-700/10"
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
                                                placeholder="Any type of Video generation "
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
                    {!video && !isLoading && (
                        <div>
                            No video generate
                        </div>
                    )}
                       {video && (
                        <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
                          <source src={video} />
                        </video>
                       )}
                </div>
            </div>
        </div>
    );
};

export default Videopage;
