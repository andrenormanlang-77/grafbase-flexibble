"use client"

import { SessionInterface, ProjectInterface, FormState } from "@/common.types"
import Image from "next/image"
import React, { ChangeEvent, useState } from "react"
import FormField from "./FormField"
import Button from "./Button"
import { categoryFilters } from "@/constants"
import CustomMenu from "./CustomMenu"
import { createNewProject, fetchToken } from "@/lib/actions"
import { useRouter } from "next/navigation"

type Props = {
    type: string,
    session: SessionInterface,
    project?: ProjectInterface   
}

const ProjectForm = ({ type, session, project }: Props) => {

    const router = useRouter()

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitting(true)

        const { token } = await fetchToken()

        try {
            if (type === "create") {
                await createNewProject(form, session?.user?.id, token)

                router.push("/")
            }
            
            // if (type === "edit") {
            //     await updateProject(form, project?.id as string, token)

            //     router.push("/")
            // }

        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false)
        }
    }

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.includes('image')) {
            alert('Please upload an image!');

            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;

            handleStateChange("image", result)
        };
    };

    const handleStateChange = (fieldName: keyof FormState, value: string) => {
        setForm((prevForm) => 
        ({ ...prevForm, [fieldName]: value }));
    };

    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<FormState>({
        title: project?.title || "",
        description: project?.description || "",
        image: project?.image || "",
        liveSiteUrl: project?.liveSiteUrl || "",
        githubUrl: project?.githubUrl || "",
        category: project?.category || ""
    })
  return (
    <form
        onSubmit={handleFormSubmit}
        className="flexStart form"
    >
        <div className="flexStart form_image-container">
            <label htmlFor="poster" className="flexCenter form_image-label">
                {!form.image && 'Choose a poster for your project'}
            </label>
            <input
                id="image"
                type="file"
                accept='image/*'
                required={type === "create" ? true : false}
                className="form_image-input"
                onChange={handleChangeImage}
            />
            {form.image && (
                <Image
                    src={form?.image}
                    className="sm:p-10 object-contain z-20" 
                    alt="Project poster"
                    fill
                />
            )}
        </div>
        <FormField
            title="Title"
            state={form.title}
            placeholder="Flexibble"
            setState={(value) => handleStateChange('title', value)}
        />
        <FormField
            title='Description'
            state={form.description}
            placeholder="Showcase and discover remarkable developer projects."
            isTextArea
            setState={(value) => handleStateChange('description', value)}
        />

        <FormField
            type="url"
            title="Website URL"
            state={form.liveSiteUrl}
            placeholder="https://portfolio-andre-lang.netlify.app/"
            setState={(value) => handleStateChange('liveSiteUrl', value)}
        />

        <FormField
            type="url"
            title="GitHub URL"
            state={form.githubUrl}
            placeholder="https://github.com/andrenormanlang"
            setState={(value) => handleStateChange('githubUrl', value)}
        />

        <CustomMenu
            title="Category"
            state={form.category}
            filters={categoryFilters}
            setState={(value) => handleStateChange('category', value)}
        />

        <div className="flexStart w-full">
            <Button
                title={
                    submitting 
                    ? `${type === "create" 
                        ? "Creating" 
                        : "Editing"}` 
                        : `${type === "create" 
                            ? "Create" 
                            : "Edit"}`
                }
                type="submit"
                leftIcon={submitting ? "" : "/plus.svg"}
                submitting={submitting}
            />
        </div>
    
    </form>
  )
}

export default ProjectForm
