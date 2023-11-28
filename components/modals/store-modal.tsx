"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModalStore } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// declaring schema for the store modal (zod). Here you can manually set the type of the schema and errors that will be ocurred
const formSchema = z.object({
  name: z.string().min(3).max(50),
});

export const StoreModal = () => {
  // using the store modal hook to get the state and methods
  const storeModal = useStoreModalStore();

  const [loading, setLoading] = useState(false);

  // using react-hook-form to handle the form. in type we are infering the type of the schema
  const form = useForm<z.infer<typeof formSchema>>({
    // using zod resolver to validate the form
    resolver: zodResolver(formSchema),
    // setting default values for the form
    defaultValues: {
      name: "",
    },
  });

  // again using zod to infer the type of the form values
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitting data, store name is:", values);
    try {
      setLoading(true);
      const res = await axios.post("/api/stores", values);

      // next will redirect to the store page (refreshing the page)
      window.location.assign(`/${res.data.id}`);
      // why not using redirect from next/navigation? because when db is not ready yet, it will redirect to the store page and will show 404 error
    } catch (error: any) {
      toast.error("Failed to POST data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage your products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="E-Commerce"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex item-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
