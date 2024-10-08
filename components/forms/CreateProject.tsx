"use client"

import { z } from "zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SymbolIcon } from "@radix-ui/react-icons";
import { FileUploader } from "../functions/FileUploader";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/types/appwrite.types";

export const CreateProject = () => {
    const schema = projectSchema();
    const t = useTranslations("Admin.Create");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            imageURL: [],
            githubURL: "",
            liveURL: "",
            date: new Date().toISOString(),
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        setIsLoading(true);

        let formData;
        if (values.imageURL && values.imageURL?.length > 0) {
            const blobFile = new Blob([values.imageURL[0]], {
                type: values.imageURL[0].type,
            });

            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.imageURL[0].name);
        }

        try {
            const project = {
                title: values.title,
                subtitle: values.subtitle,
                description: values.description,
                imageURL: values.imageURL ? formData : undefined,
                githubURL: values.githubURL,
                liveURL: values.liveURL,
                date: values.date,
            };

            const response = await fetch('/admin/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (response.ok) {
                toast.success(t("Status.Success"));
                form.reset();
            };

        } catch (error: any) {
            toast.error(t("Status.Error"), error.message);
        };

        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 overflow-hidden mt-8 px-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder={t("Title")} {...field} className="glassmorphism bg-zinc-200 backdrop-blur-[33px] bg-opacity-50 bg-clip-padding shadow-lg p-2 w-full rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder={t("Subtitle")} {...field} className="glassmorphism bg-zinc-200 backdrop-blur-[33px] bg-opacity-50 bg-clip-padding shadow-lg p-2 w-full rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                    <div className="flex flex-col gap-4 w-full">
                        <FormField
                            control={form.control}
                            name="githubURL"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input placeholder={t("Github")} {...field} className="glassmorphism bg-zinc-200 backdrop-blur-[33px] bg-opacity-50 bg-clip-padding shadow-lg p-2 w-full rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="liveURL"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input placeholder={t("Live")} {...field} className="glassmorphism bg-zinc-200 backdrop-blur-[33px] bg-opacity-50 bg-clip-padding shadow-lg p-2 w-full rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Textarea placeholder={t("Description")} {...field} className="h-full glassmorphism bg-zinc-200 backdrop-blur-[33px] bg-opacity-50 bg-clip-padding shadow-lg p-2 w-full rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="imageURL"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-center w-full pb-6">
                    <button type="submit" className="button">
                        {isLoading ? (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <SymbolIcon className="animate-spin" />
                                <p>{t("Submit")}</p>
                            </div>
                        ) : (
                            <p>{t("Submit")}</p>
                        )}
                    </button>
                </div>
            </form>
        </Form>
    );
};
