import {z} from "zod";


export const AuthDto = z.object({
    email:
        z.email({message: 'Email is required'})
})

export type AuthDtoType = z.infer<typeof AuthDto>;