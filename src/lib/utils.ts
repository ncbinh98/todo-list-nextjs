import { useToast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CallAPIInterface {
  url: string;
  method: string;
  headers?: any;
  body?: any;
  params?: any;
  setIsLoading?: any;
  toast?: {
    toastFn: any;
    success?: {
      title?: string;
      description?: string;
      variant?: any;
    };
    error?: {
      title?: string;
      description?: string;
      variant?: any;
    };
  };
}

export const callAPI = async (infoCall: CallAPIInterface) => {
  const { url, headers, setIsLoading, toast } = infoCall
  try {
    if (setIsLoading) setIsLoading(true);
    const response = await fetch(`https://api.thefaceon3d.com/api/v1/${url}/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      ...infoCall
    
    });
    const data = await response.json();
    if (toast) {
      const { success, error } = toast;
      if (response.ok) {
        if (success) toast.toastFn({ title: success.title, description: success.description, variant: success.variant || "default" });
      } else {
        if (error) toast.toastFn({ title: error.title, description: data||error.description, variant: error.variant || "default" });
      }
    }
    return data;
  } catch (error) {
    if (toast && toast.error) {
      toast.toastFn({ title: toast.error.title, description: JSON.stringify(error), variant: toast.error.variant || "default" });
    }
    throw error;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};
