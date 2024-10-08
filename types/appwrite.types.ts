"use client"

import { z } from "zod";
import { useTranslations } from "next-intl";

export interface Project {
    $id?: string;
    title: string;
    subtitle: string;
    description: string;
    imageURL: string;
    githubURL: string;
    liveURL: string;
    date: string;
};

export interface CreateProject {
    title: string;
    subtitle: string;
    description: string;
    imageURL: FormData | undefined;
    githubURL: string;
    liveURL: string;
    date: string;
}

export const projectSchema = () => {
    const t = useTranslations("Admin.Create");

    const schema = z.object({
        title: z.string().min(2, {
            message: t("Errors.Title"),
        }),
        subtitle: z.string().min(2, {
            message: t("Errors.Subtitle"),
        }),
        description: z.string().min(2, {
            message: t("Errors.Description"),
        }),
        githubURL: z.string().min(2, {
            message: t("Errors.Github"),
        }),
        liveURL: z.string().min(2, {
            message: t("Errors.Live"),
        }),
        imageURL: z.custom<File[]>(),
        date: z.string(),
    })

    return schema;
};
