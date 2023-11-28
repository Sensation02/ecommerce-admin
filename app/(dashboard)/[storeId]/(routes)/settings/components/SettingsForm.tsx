"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/ApiAlert";
import { useOrigin } from "@/hooks/use-origins";

type Props = {
  initialState: Store;
};

const formSchema = z.object({
  name: z.string().min(1).max(255),
});

type FormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<Props> = ({ initialState }) => {
  const form = useForm<FormValues>({
    defaultValues: initialState,
    resolver: zodResolver(formSchema),
  });

  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const origin = useOrigin();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);

      router.refresh();
      // refreshing the router will revalidate the store and update the UI with the new data
      toast.success("Store updated.");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();
      router.push("/"); // remember - after we get to the homepage, there will be shown another store (if exists), if not - the user will be redirected to the create store page (modal will be shown)
      toast.success("Store deleted.");
    } catch (error: any) {
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage your store's settings." />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash size={16} />
        </Button>
      </div>
      <Separator orientation="horizontal" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator orientation="horizontal" />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}}`}
        variant="public"
      />
    </>
  );
};

// ApiAlert is made to show the API URL to the user, so he can use it in his frontend app.
