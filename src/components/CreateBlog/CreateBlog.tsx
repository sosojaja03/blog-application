import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
// import { userAtom } from "@/store/auth";
import { supabase } from "@/supabase";
// import { useAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { UseAuthContext } from "../context/hooks/AuthContextHook";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type BlogsListCreateValues = {
  title_ka: string;
  title_en: string;
  description_ka: string;
  description_en: string;
  image_file: null | File;
};

const BlogsListFilterFormDefaultValues = {
  title_ka: "",
  description_ka: "",
  title_en: "",
  description_en: "",
  image_file: null,
};

const CreateBlogForm = () => {
  const { handleSetUser } = UseAuthContext();
  const queryClient = useQueryClient();

  const { control, handleSubmit } = useForm<BlogsListCreateValues>({
    defaultValues: BlogsListFilterFormDefaultValues,
  });

  const { mutate: addBlog } = useMutation({
    mutationFn: async (formValues: BlogsListCreateValues) => {
      console.log(formValues);

      if (formValues?.image_file) {
        try {
          const { error, data } = await supabase.storage
            .from("blog_images")
            .upload(formValues?.image_file?.name, formValues?.image_file);

          if (error) {
            console.error("Upload error:", error);
            // Display an error message to the user
            alert("Error uploading image. Please try again.");
            return;
          }

          console.log("Upload successful:", data);

          const { error: insertError, data: insertData } = await supabase
            .from("blogs")
            .insert({
              title_en: formValues.title_en,
              description_en: formValues.description_en,
              image_url: data?.fullPath,
              user_id: handleSetUser?.user?.id,
            });

          if (insertError) {
            console.error("Insert error:", insertError);
            // Display an error message to the user
            alert("Error creating the blog post. Please try again.");
            return;
          }

          console.log("Successfully Created Blog: ", insertData);
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          // Display a generic error message to the user
          alert("An unexpected error occurred. Please try again later.");
        }
      }
    },
    onSuccess: () => {
      console.log("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const onSubmit = (data: BlogsListCreateValues) => {
    addBlog(data);
  };

  // return (
  //   <div className="flex flex-col items-center justify-center gap-y-4">
  //     <div className="flex w-96 flex-col items-center justify-center gap-y-4">
  //       <Controller
  //         control={control}
  //         name="title_en"
  //         render={({ field: { onChange, value } }) => {
  //           return (
  //             <Input onChange={onChange} value={value} placeholder="Title" />
  //           );
  //         }}
  //       />
  //       <Controller
  //         control={control}
  //         name="description_en"
  //         render={({ field: { onChange, value } }) => {
  //           return (
  //             <Input
  //               onChange={onChange}
  //               value={value}
  //               placeholder="Description"
  //             />
  //           );
  //         }}
  //       />
  //       <Controller
  //         control={control}
  //         name="image_file"
  //         render={({ field: { onChange } }) => {
  //           return (
  //             <Input
  //               type="file"
  //               onChange={(e) => {
  //                 const file = e.target.files?.[0];
  //                 onChange(file);
  //               }}
  //               placeholder="File"
  //             />
  //           );
  //         }}
  //       />
  //       <Button onClick={handleSubmit(addBlog)}>Create Blog</Button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <div className="flex w-96 flex-col items-center justify-center gap-y-4">
        <Controller
          control={control}
          name="title_en"
          rules={{ required: "Title is required" }} // Add validation
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Input onChange={onChange} value={value} placeholder="Title" />
              {error && <p className="text-red-500">{error.message}</p>}
            </>
          )}
        />
        <Controller
          control={control}
          name="description_en"
          rules={{ required: "Description is required" }} // Add validation
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Input
                onChange={onChange}
                value={value}
                placeholder="Description"
              />
              {error && <p className="text-red-500">{error.message}</p>}
            </>
          )}
        />
        <Controller
          control={control}
          name="image_file"
          render={({ field: { onChange } }) => (
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file);
              }}
              placeholder="File"
            />
          )}
        />
        <Button onClick={handleSubmit(onSubmit)}>Create Blog</Button>
      </div>
    </div>
  );
};

export default CreateBlogForm;
