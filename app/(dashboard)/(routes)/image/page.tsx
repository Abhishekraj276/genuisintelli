"use client"
import axios from "axios";
import * as z from "zod";
import { Heading } from '@/components/heading';
import { Download, ImageIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {
    amountOptions,
    formSchema, 
    resolutionOptions
} from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";




const ImagePage = () => {
    const router = useRouter();
    const [images, setImage] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
            amount: "1",
            resolution: "512x512"
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImage([]);
            const response = await axios.post('/api/image', values);

            const urls = response.data.map((image: { url: string }) => image.url);
            setImage(urls);
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
                title="Image Generation"
                description="Turn your prompt into an image."
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
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
                                                placeholder="A Picture of a horse in Swiss alps"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) =>
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((Option) => (
                                                    <SelectItem
                                                        key={Option.value}
                                                        value={Option.value}
                                                    >
                                                        {Option.label}
                                                    </SelectItem>
                                                )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                }

                            />
                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({ field }) =>
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((Option) => (
                                                    <SelectItem
                                                        key={Option.value}
                                                        value={Option.value}
                                                    >
                                                        {Option.label}
                                                    </SelectItem>
                                                )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                }

                            />
                            <Button className="col-span-12 lg:col-span-2" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="mt-4 space-y-4">
                    {isLoading && (
                        <div className="p-20 ">
                            <Loader />
                        </div>
                    )

                    }
                    {images.length === 0 && !isLoading && (
                        <div>
                            No images generate
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                       {images.map((src) =>(
                        <Card
                         key={src}
                         className="rounded-lg overflow-hidden"
                        >
                        <div className="relative aspect-square">
                         <Image 
                          alt="Image"
                          fill
                          src={src}
                         />
                        </div>
                        <CardFooter className="p-2">
                          <Button 
                          onClick={() => window.open(src)}
                          variant="secondary" className="w-full">
                           <Download className="h-4 w-4 mr-2"/>
                           Download
                          </Button>
                        </CardFooter>
                        </Card>
                       ))} 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePage;
