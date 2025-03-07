import { toast } from "sonner"


export const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    redirectPath?: string
) => {
    if (type === 'success') {
        toast.success(message)
    } else if (type === 'error') {
        toast.error(message)
    } else if (type === 'warning') {
        toast.warning(message)
    } else {
        toast.info(message)
    } 

    if (redirectPath) {
        // redirect(redirectPath) 
    }
}